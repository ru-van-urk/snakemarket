<script setup>
  import Header from "~/components/header.vue";
</script>

<template>
  <NuxtLayout>
    <Header />
    <main class="container mx-auto px-4">
      <NuxtPage class="pt-16" />
    </main>
  </NuxtLayout>
</template>
