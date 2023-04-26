<script setup lang="ts">
  import { useQuery } from "@tanstack/vue-query";
  import { z } from "zod";

  const config = useRuntimeConfig();

  const productSchema = z.object({
    ProductID: z.number(),
    MainDescription: z.string(),
    Brand: z.string().nullable(),
    WebSubGroups: z.array(z.any()),
    ProductOffers: z.array(z.any()),
    ProductPrices: z.array(z.object({ RegularPrice: z.number() })),
    ProductPictures: z.array(
      z.object({
        Url: z.string(),
        IsPrimary: z.boolean(),
      })
    ),
  });

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["DekaProducts"],
    queryFn: () =>
      fetch(
        `https://api.dekamarkt.nl/v1/assortmentcache/group/281/104?api_key=${config.public.dekaApiKey}`
      )
        .then((res) => res.json())
        .then((val) => z.array(productSchema).parse(val)),
  });
</script>

<template>
  <main>
    <section>
      <h1>Index</h1>
      <span v-if="isLoading">Loading...</span>
      <span v-else-if="isError">Error: {{ (error as Error).message }}</span>

      <ul v-else-if="products">
        <li v-for="product in products" :key="product.ProductID">
          <img
            :src="product.ProductPictures.find((img) => img.IsPrimary)?.Url"
            width="200"
          />
          <h2>{{ product.MainDescription }}</h2>
          <p>€{{ product.ProductPrices[0].RegularPrice }}</p>

          <span class="quantity-controller">
            <button class="remove">-</button>
            <p>0</p>
            <button class="add">+</button>
          </span>

          <!-- {{ JSON.stringify(product) }} -->
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped lang="scss">
  main {
    width: 100vw;
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

    margin: 80px 0;
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
