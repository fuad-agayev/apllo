<template>
  <div>
    <h2>Add Game</h2>
    <form @submit.prevent="submitGame">
      <input v-model="title" placeholder="Title" />
      <input v-model="platforms" placeholder="Platforms (comma separated)" />
      <button type="submit">Add</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { ADD_GAME } from '../graphql/mutations'

const title = ref('')
const platforms = ref('')

const { mutate: addGame } = useMutation(ADD_GAME)

const submitGame = () => {
  const platformArray = platforms.value.split(',').map(p => p.trim())
  addGame({
    game: {
      title: title.value,
      platform: platformArray
    }
  })
  title.value = ''
  platforms.value = ''
}
</script>
