<!-- components/UpdateGame.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { UPDATE_GAME } from '../graphql/mutations'

const props = defineProps<{
  id: string
  currentTitle: string
  currentPlatform: string[]
  onUpdated?: () => void
}>()

const title = ref(props.currentTitle)
const platform = ref(props.currentPlatform.join(', ')) // kullanıcıya virgülle yazdırırız

const { mutate: updateGame, onDone, onError } = useMutation(UPDATE_GAME)

const loading = ref(false)
const error = ref<string | null>(null)

const handleUpdate = async () => {
  loading.value = true
  error.value = null

  try {
    await updateGame({
  variables: {
    id: props.id,
    editGame: {
      title: title.value,
      platform: platform.value.split(',').map(p => p.trim())
    }
  }
})

    props.onUpdated?.()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleUpdate">
    <input v-model="title" placeholder="Title" />
    <input v-model="platform" placeholder="Platform (comma separated)" />
    <button type="submit" :disabled="loading">
      {{ loading ? 'Updating...' : 'Update' }}
    </button>
    <p v-if="error" style="color: red;">Error: {{ error }}</p>
  </form>
</template>
