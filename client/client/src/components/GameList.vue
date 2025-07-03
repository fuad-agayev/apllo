

<!-- src/components/GameList.vue -->
<script setup lang="ts">
/* -------------------------------------------------- */
/*  GEREKLİ KÜTÜPHANELER                              */
/* -------------------------------------------------- */
import { computed, ref } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { GET_GAMES } from '../graphql/queries'
import { UPDATE_GAME } from '../graphql/mutations'
import DeleteGame from './DeleteGame.vue'

/* -------------------------------------------------- */
/*  1) OYUN LİSTESİ SORGUSU                            */
/* -------------------------------------------------- */
const { result, loading, error, refetch } = useQuery(GET_GAMES)
const games = computed(() => result.value?.games ?? [])

/* -------------------------------------------------- */
/*  2) OYUN GÜNCELLEME MUTASYONU                      */
/* -------------------------------------------------- */
const { mutate: updateGame } = useMutation(UPDATE_GAME)

/* -------------------------------------------------- */
/*  3) DÜZENLEME DURUMU (LOCAL STATE)                 */
/* -------------------------------------------------- */
const editingId      = ref<string | null>(null)
const editTitle      = ref('')
const editPlatforms  = ref('')

function startEdit(game: { id: string; title: string; platform: string[] }) {
  editingId.value   = game.id
  editTitle.value   = game.title
  editPlatforms.value = game.platform.join(', ')
}

function cancelEdit() {
  editingId.value = null
}

/* -------------------------------------------------- */
/*  4) KAYDET → updateGame                            */
/* -------------------------------------------------- */
async function saveEdit(id: string) {
  try {
    await updateGame({
      
        id,
        editGame: {
          title: editTitle.value,
          platform: editPlatforms.value
                    .split(',')
                    .map(p => p.trim())
        }
      
    })
    editingId.value = null          // formu kapat
    /* Apollo cache ilgili Game nesnesini döndürdüğümüz için
       otomatik güncellenir; yine de tam listeyi yenilemek isterseniz:
       await refetch()
    */
  } catch (err: any) {
    alert('Update failed: ' + err.message)
  }
}
</script>

<template>
  <div v-if="loading">Loading…</div>
  <div v-else-if="error">Error: {{ error.message }}</div>

  <ul v-else>
    <li v-for="game in games" :key="game.id">
      <!-- DÜZENLEME MODU ------------------------------------- -->
      <template v-if="editingId === game.id">
        <input v-model="editTitle"               style="margin-right:4px" />
        <input v-model="editPlatforms"           style="margin-right:4px"
               placeholder="Platforms (comma separated)" />
        <button @click="saveEdit(game.id)">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </template>

      <!-- NORMAL GÖRÜNÜM ------------------------------------- -->
      <template v-else>
        {{ game.title }} ({{ game.platform.join(', ') }})
        <button @click="startEdit(game)">Edit</button>
        <DeleteGame :gameId="game.id" :onDeleted="refetch" />
      </template>
    </li>
  </ul>
</template>


