<template>
  <div>
    <h1>Game Store</h1>
    <GameForm />
    <GameList />
  
    <!-- GameDetails bileşeni, seçilen oyunun detaylarını gösterir -->
  </div>
</template>

<script setup lang="ts">
import GameForm from '@/components/GameForm.vue'
import GameList from '@/components/GameList.vue'

</script>