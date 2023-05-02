<script setup lang="ts">
  import { useHead, useRoute } from "nuxt/app";
  import { z } from "zod";
  import useProducts from "~/composables/useProducts";
  import Spinner from "~/components/spinner.vue";
  import { cn } from "~/utils/helpers";
  import useCart from "~/composables/useCart";

  import { ChevronLeftIcon } from "@heroicons/vue/24/solid";
  import { Product } from "~/schemas/product";

  const route = useRoute();
  const cartStore = useCart();

  const productId = z
    .string()
    .transform((val) => Number(val))
    .parse(route.params.id);

  const { data: products, pending, error } = await useProducts();

  const product = products.value?.find(
    (p) => p.ProductID === productId
  ) as Product;

  useHead({
    title: `Snake 🛒 Markt -  ${product.BrandInfo?.Description ?? ""} ${
      product?.MainDescription
    }`,
  });
</script>

<template>
  <span v-if="pending" class="w-full h-screen flex items-center justify-center">
    <Spinner />
  </span>
  <span v-else-if="error">Error: {{ error.message }}</span>

  <div v-else="product">
    <div class="py-6">
      <NuxtLink to="/">
        <span
          class="flex items-center gap-2 hover:text-red-500 hover:underline"
        >
          <ChevronLeftIcon class="w-3 h-3" />
          <p class="text-sm">Terug naar overzicht</p>
        </span>
      </NuxtLink>
    </div>

    <div class="w-full bg-white rounded shadow">
      <div
        class="p-4 flex justify-center items-center gap-5 md:gap-40 flex-col md:flex-row"
      >
        <img
          :src="product.ProductPictures.find((img) => img.IsPrimary)?.Url"
          :alt="`Productfoto voor ${product.MainDescription}`"
          class="w-40 md:w-96"
        />

        <span class="flex flex-col gap-5 justify-center w-52">
          <span>
            <h3 class="font-light text-base md:text-xl">
              {{ product.BrandInfo?.Description ?? "&nbsp;" }}
            </h3>

            <h2 class="font-bold truncate hover:text-clip text-xl md:text-2xl">
              {{ product.MainDescription ?? "&nbsp;" }}
            </h2>
          </span>

          <p class="font-semibold text-sm md:text-base">
            €{{ product.ProductPrices[0].RegularPrice ?? "&nbsp;" }} per stuk
          </p>

          <span
            v-if="cartStore.getQuantity(product.ProductID) > 0"
            class="w-full flex"
          >
            <button
              class="py-2 px-4 bg-red-600 rounded text-white hover:animate-wiggle"
              @click="() => cartStore.removeFromCart(product.ProductID)"
            >
              -
            </button>
            <p class="py-2 px-4">
              {{ cartStore.getQuantity(product.ProductID) }}
            </p>
            <button
              class="py-2 px-4 bg-red-600 rounded text-white hover:animate-wiggle"
              @click="() => cartStore.addToCart(product.ProductID)"
            >
              +
            </button>
          </span>

          <span v-else class="w-full">
            <button
              :class="
                cn(
                  'bg-red-600 text-white py-2 px-4 rounded w-full',
                  'hover:animate-wiggle',
                  'text-sm md:text-base'
                )
              "
              @click="() => cartStore.addToCart(product.ProductID)"
            >
              In winkelwagen
            </button>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
