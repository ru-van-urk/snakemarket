<script setup lang="ts">
  import { Product } from "~/schemas/product";
  import { useCartStore } from "~/stores/useCartStore";
  import { cn } from "~/utils/helpers";

  const { product } = defineProps<{ product: Product }>();

  const cart = useCartStore();

  const log = () => console.log("hey");
</script>

<template>
  <div
    :class="cn('group border rounded m-4  shadow bg-white', 'w-2/5 sm:w-56')"
  >
    <div
      class="p-4 flex items-center justify-center border-b cursor-pointer"
      @click="() => log()"
    >
      <img
        :src="product.ProductPictures.find((img) => img.IsPrimary)?.Url"
        width="150"
        alt="Image for {{ product.BrandInfo?.Description }}"
        :class="'hover:scale-105 transition'"
      />
    </div>

    <div class="p-4 flex flex-col gap-3 w-full">
      <span>
        <h3 class="font-light text-sm">
          {{ product.BrandInfo?.Description }}
        </h3>

        <h2 class="font-bold truncate hover:text-clip">
          {{ product.MainDescription }}
        </h2>
      </span>

      <p class="font-semibold text-xs p">
        €{{ product.ProductPrices[0].RegularPrice }} per stuk
      </p>

      <span
        v-if="cart.getQuantity(product.ProductID) > 0"
        class="w-full flex justify-between"
      >
        <button
          class="py-2 px-4 bg-red-600 rounded text-white"
          @click="() => cart.removeFromCart(product.ProductID)"
        >
          -
        </button>
        <p class="py-2 px-4">{{ cart.getQuantity(product.ProductID) }}</p>
        <button
          class="py-2 px-4 bg-red-600 rounded text-white"
          @click="() => cart.addToCart(product.ProductID)"
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
          @click="() => cart.addToCart(product.ProductID)"
        >
          In winkelwagen
        </button>
      </span>
    </div>
  </div>
</template>
