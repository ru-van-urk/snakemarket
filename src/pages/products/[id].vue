<script setup lang="ts">
  import { useRoute } from "nuxt/app";
  import { z } from "zod";
  import useProducts from "~/composables/useProducts";
  import Spinner from "~/components/spinner.vue";

  const route = useRoute();

  const productId = z
    .string()
    .transform((val) => Number(val))
    .parse(route.params.id);

  const { data: products, pending, error } = await useProducts();

  const product = products.value?.find((p) => p.ProductID === productId);
</script>

<template>
  <span v-if="pending" class="w-full h-screen flex items-center justify-center">
    <Spinner />
  </span>
  <span v-else-if="error">Error: {{ error.message }}</span>

  <p v-else>{{ JSON.stringify(product) }}</p>
</template>
