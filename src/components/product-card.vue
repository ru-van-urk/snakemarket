<script setup lang="ts">
  import { Product } from "~/schemas/product";
  import useCart from "~/composables/useCart";
  import { cn } from "~/utils/helpers";
  import { ref } from "vue";
  import { useState } from "nuxt/app";
  import { animateCart } from "~/utils/animateCart";

  const { product } = defineProps<{ product: Product }>();

  const cartStore = useCart();

  const imageRef = ref<HTMLImageElement>();
  const cartRef = useState<HTMLSpanElement>("cartRef");

  const addToCart = () => {
    cartStore.addToCart(product.ProductID);
    animateCart("to-cart", imageRef.value, cartRef.value);
  };

  const removeFromCart = () => {
    if (cartStore.getQuantity(product.ProductID) === 1) {
      animateCart("from-cart", imageRef.value, cartRef.value);
    }

    cartStore.removeFromCart(product.ProductID);
  };
</script>

<template>
  <div :class="cn('group border rounded shadow bg-white', 'w-40 sm:w-56')">
    <NuxtLink :to="`/products/${product.ProductID}`">
      <div
        class="p-4 flex items-center justify-center border-b cursor-pointer relative"
      >
        <img
          ref="imageRef"
          :src="product.ProductPictures.find((img) => img.IsPrimary)?.Url"
          :alt="`Productfoto voor ${product.MainDescription}`"
          :class="'hover:scale-105 transition w-[150px]'"
        />
      </div>
    </NuxtLink>

    <div class="p-4 flex flex-col gap-3 w-full">
      <span>
        <h3 class="font-light text-sm">
          {{ product.BrandInfo?.Description ?? "&nbsp;" }}
        </h3>

        <NuxtLink :to="`/products/${product.ProductID}`">
          <h2 class="font-bold truncate hover:text-clip">
            {{ product.MainDescription ?? "&nbsp;" }}
          </h2>
        </NuxtLink>
      </span>

      <p class="font-semibold text-xs p">
        €{{ product.ProductPrices[0].RegularPrice ?? "&nbsp;" }} per stuk
      </p>

      <span
        v-if="cartStore.getQuantity(product.ProductID) > 0"
        class="w-full flex justify-between"
      >
        <button
          class="py-2 px-4 bg-red-600 rounded text-white hover:animate-wiggle"
          @click="removeFromCart"
        >
          -
        </button>
        <p class="py-2 px-4">{{ cartStore.getQuantity(product.ProductID) }}</p>
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
              'text-sm sm:text-base'
            )
          "
          @click="addToCart"
        >
          In winkelwagen
        </button>
      </span>
    </div>
  </div>
</template>
