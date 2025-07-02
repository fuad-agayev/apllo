<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { GET_GAMES } from '../graphql/queries'
import { computed, ref } from 'vue'
import DeleteGame from './DeleteGame.vue'
import UpdateGame from './UpdateGame.vue'

const { result, loading, error, refetch } = useQuery(GET_GAMES)

const refreshGames = () => {
  refetch()
}
const editingId = ref<string | null>(null)
// `games` computed olarak result.value.games'e ulaşır
const games = computed(() => result.value?.games ?? [])
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <ul>
    <li v-for="game in games" :key="game.id">
      {{ game.title }} ({{ game.platform.join(', ') }})
       <DeleteGame :gameId="game.id" :onDeleted="refreshGames" />

        <button @click="editingId = game.id">Edit</button>

      <UpdateGame
        v-if="editingId === game.id"
        :id="game.id"
        :currentTitle="game.title"
        :currentPlatform="game.platform"
        :onUpdated="() => { editingId = null; refetch() }"
      />
    </li>
  </ul>
</template>


