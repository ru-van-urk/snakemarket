<script setup lang="ts">
  import { ShoppingBagIcon } from "@heroicons/vue/24/solid";
  import { useCartStore } from "~/stores/useCartStore";

  const cartStore = useCartStore();
</script>

<template>
  <header
    class="flex items-center justify-center w-full fixed top-0 bg-white border-b z-10 h-16 px-4"
  >
    <span class="flex container mx-auto justify-between">
      <h1 class="text-xl font-bold uppercase text-red-600">Snakemarkt</h1>

      <span class="flex gap-2">
        <ShoppingBagIcon class="h-5 w-5 text-red-600" />
        <p>{{ cartStore.cart.length }}</p>
      </span>
    </span>
  </header>
</template>
