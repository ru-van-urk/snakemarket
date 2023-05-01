<script setup lang="ts">
  import { ShoppingBagIcon, ShoppingCartIcon } from "@heroicons/vue/24/solid";
  import { useState } from "nuxt/app";
  import useCart from "~/composables/useCart";

  const cartStore = useCart();
  const cartRef = useState("cartRef");
</script>

<template>
  <header
    class="flex items-center justify-center w-full fixed top-0 bg-white border-b z-10 h-16"
  >
    <span class="flex container mx-auto justify-between px-4">
      <NuxtLink to="/">
        <span class="flex gap-2 items-center">
          <p class="text-xl font-bold uppercase text-red-600">Snake</p>
          <ShoppingCartIcon class="h-5 w-5 text-slate-900" />
          <p class="text-xl font-bold uppercase text-red-600">markt</p>
        </span>
      </NuxtLink>

      <span class="flex gap-2" ref="cartRef">
        <ShoppingBagIcon class="h-5 w-5 text-red-600" />
        <p>{{ cartStore.cart.value.length }}</p>
      </span>
    </span>
  </header>
</template>
