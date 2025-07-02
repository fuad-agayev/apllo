<!-- components/DeleteGame.vue -->
<script setup lang="ts">
import { DELETE_GAME } from '../graphql/mutations'
import { useMutation } from '@vue/apollo-composable'
import { ref, defineProps, watchEffect } from 'vue'

const props = defineProps<{
  gameId: string
  onDeleted?: () => void // Oyun silindikten sonra listeyi güncellemek için opsiyonel callback
}>()

const { mutate: deleteGame, onDone, onError } = useMutation(DELETE_GAME)

const loading = ref(false)
const error = ref<string | null>(null)

const handleDelete = async () => {
  loading.value = true
  error.value = null
  try {
    await deleteGame({ id: props.gameId })
    props.onDeleted?.()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button @click="handleDelete" :disabled="loading">
    {{ loading ? 'Deleting...' : 'Delete' }}
  </button>
  <p v-if="error" style="color: red">Error: {{ error }}</p>
</template>
