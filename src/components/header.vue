<script setup lang="ts">
  import { ShoppingBagIcon } from "@heroicons/vue/24/solid";
  import { useState } from "nuxt/app";
  import useCart from "~/composables/useCart";

  const cartStore = useCart();

  const cartRef = useState("cartRef");
</script>

<template>
  <header
    class="flex items-center justify-center w-full fixed top-0 bg-white border-b z-10 h-16 px-4"
  >
    <span class="flex container mx-auto justify-between">
      <h1 class="text-xl font-bold uppercase text-red-600">Snakemarkt</h1>

      <span class="flex gap-2" ref="cartRef">
        <ShoppingBagIcon class="h-5 w-5 text-red-600" />
        <p>{{ cartStore.cart.value.length }}</p>
      </span>
    </span>
  </header>
</template>
