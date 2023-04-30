<script setup lang="ts">
  import { productSchema } from "~/schemas/product";
  import FilterBar from "~/components/filter-bar.vue";
  import { productSort } from "~/utils/productSort";
  import { productFilter } from "~/utils/getProductFilters";
  import { useCartStore } from "~/stores/useCartStore";
  import { z } from "zod";
  import { useAsyncData, useRuntimeConfig } from "nuxt/app";

  const config = useRuntimeConfig();

  const {
    data: products,
    pending,
    error,
  } = await useAsyncData(
    "products",
    () =>
      $fetch("https://api.dekamarkt.nl/v1/assortmentcache/group/281/104", {
        query: { api_key: config.public.dekaApiKey },
      }),
    {
      transform: (res) => z.array(productSchema).parse(res),
    }
  );

  const cart = useCartStore();
</script>

<template>
  <div>
    <span v-if="pending">Loading...</span>
    <span v-else-if="error">Error: {{ error.message }}</span>

    <main v-else-if="products">
      <FilterBar />

      <section>
        <ul>
          <li
            v-for="product in products.filter(productFilter).sort(productSort)"
            :key="product.ProductID"
          >
            <img
              :src="product.ProductPictures.find((img) => img.IsPrimary)?.Url"
              width="200"
              alt="Image for {{ product.BrandInfo?.Description }}"
            />
            <h2>{{ product.BrandInfo?.Description }}</h2>
            <h3>{{ product.MainDescription }}</h3>
            <p>€{{ product.ProductPrices[0].RegularPrice }}</p>

            <span class="quantity-controller">
              <button
                class="remove"
                @click="() => cart.removeFromCart(product.ProductID)"
              >
                -
              </button>
              <p>{{ cart.getQuantity(product.ProductID) }}</p>
              <button
                class="add"
                @click="() => cart.addToCart(product.ProductID)"
              >
                +
              </button>
            </span>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
  main {
    width: 100vw;
  }

  header {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
  }

  section {
    max-width: 1200px;
    margin: 0 auto;
  }

  ul {
    border: 1px solid green;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-left: 0;
    width: 100%;
  }

  ul li {
    list-style: none;
    width: calc(99% / 3);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin: 80px;
  }

  .quantity-controller {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    font-size: 20px;

    button {
      color: white;
      border: none;
      font-size: 32px;
      width: 80px;
      border-radius: 4px;
      cursor: pointer;

      &.add {
        background-color: blue;
      }

      &.remove {
        background-color: red;
      }
    }
  }
</style>
