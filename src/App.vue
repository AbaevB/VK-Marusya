<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/blocks/Header.vue'
import Footer from '@/components/blocks/Footer.vue'
</script>

<template>
  <Header />
  <main class="main">
    <RouterView />
  </main>
  <Footer />
</template>


