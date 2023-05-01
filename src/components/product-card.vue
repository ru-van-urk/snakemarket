<script setup lang="ts">
  import { Product } from "~/schemas/product";
  import { useCartStore } from "~/stores/useCartStore";
  import { cn } from "~/utils/helpers";
  import { ref } from "vue";
  import { useState } from "nuxt/app";

  const { product } = defineProps<{ product: Product }>();

  const cartStore = useCartStore();

  const imageRef = ref();
  const cartRef = useState<HTMLSpanElement>("cartRef");

  const addToCart = () => {
    cartStore.addToCart(product.ProductID);

    const imgToDrag = imageRef.value;
    const cart = cartRef.value;

    if (imgToDrag && cart) {
      const imgClone = imgToDrag.cloneNode();
      imgClone.style.position = "absolute";
      imgClone.style.zIndex = "100";
      imgToDrag.insertAdjacentElement("afterend", imgClone);

      const {
        x: cartX,
        y: cartY,
        width: cartWidth,
        height: cartHeight,
      } = cart.getBoundingClientRect();
      const { x: imgX, y: imgY } = imgClone.getBoundingClientRect();

      const translate = {
        x: `${cartX - imgX - cartWidth * 2}px`,
        y: `${cartY - imgY - cartHeight * 2}px`,
      };

      imgClone.animate(
        [
          {
            transform: `translate(0)`,
            width: `${imgClone.width}px`,
            height: `${imgClone.height}px`,
          },
          {
            transform: `translate(${translate.x}, ${translate.y})`,
            width: "10px",
            height: "10px",
          },
        ],
        1000,
        "ease-in-out"
      ).onfinish = function () {
        imgClone.remove();
      };
    }
  };
</script>

<template>
  <div
    :class="cn('group border rounded m-4  shadow bg-white', 'w-2/5 sm:w-56')"
  >
    <div
      class="p-4 flex items-center justify-center border-b cursor-pointer relative"
    >
      <img
        ref="imageRef"
        :src="product.ProductPictures.find((img) => img.IsPrimary)?.Url"
        alt="Image for {{ product.BrandInfo?.Description }}"
        :class="'hover:scale-105 transition w-[150px]'"
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
        v-if="cartStore.getQuantity(product.ProductID) > 0"
        class="w-full flex justify-between"
      >
        <button
          class="py-2 px-4 bg-red-600 rounded text-white"
          @click="() => cartStore.removeFromCart(product.ProductID)"
        >
          -
        </button>
        <p class="py-2 px-4">{{ cartStore.getQuantity(product.ProductID) }}</p>
        <button
          class="py-2 px-4 bg-red-600 rounded text-white"
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
