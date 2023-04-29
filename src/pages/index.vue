<script setup lang="ts">
  import { Product, productSchema } from "~/schemas/product";
  import FilterBar from "~/components/filter-bar.vue";
  import { Sort, getSortedProducts } from "~/utils/getSortedProducts";
  import { Filters, getFilteredProducts } from "~/utils/getProductFilters";
  import { useCartStore } from "~/stores/useCartStore";
  import { z } from "zod";

  const config = useRuntimeConfig();

  const {
    data: products,
    pending,
    error,
  } = await useAsyncData<Product[]>(
    "products",
    () =>
      $fetch("https://api.dekamarkt.nl/v1/assortmentcache/group/281/104", {
        query: { api_key: config.public.dekaApiKey },
      }),
    {
      transform: (products) => z.array(productSchema).parse(products),
    }
  );

  const filters = useState<Filters | null>("filters", () => {
    if (!products.value) return null;
    return getProductFilters(products.value);
  });

  const filteredProducts = useState<Product[] | null>(
    "filtered-products",
    () => {
      if (!products.value || !filters.value) return null;
      return getFilteredProducts(products.value, filters.value);
    }
  );

  const sortOrder = ref<Sort>();
  const cart = useCartStore();

  // Filtering is based on the request products, not the previous filtered products,
  // Ideally this would make a new request to the server to fetch the latest data.
  const handleFiltering = () => {
    if (!products.value || !filters.value) return;
    filteredProducts.value = getFilteredProducts(products.value, filters.value);
  };

  // Sorting is based on the current filtered data.
  const handleSorting = (newSortOrder?: Sort) => {
    if (!filteredProducts.value || !products.value || !filters.value) return;

    // When the new sort order equals null reset it to the initial state
    if (!newSortOrder) {
      filteredProducts.value = getFilteredProducts(
        products.value,
        filters.value
      );
      return;
    }

    sortOrder.value = newSortOrder;
    filteredProducts.value = getSortedProducts(
      filteredProducts.value,
      newSortOrder
    );
  };
</script>

<template>
  <div>
    <span v-if="pending">Loading...</span>
    <span v-else-if="error">Error: {{ error.message }}</span>

    <main v-else>
      <FilterBar
        v-if="filters"
        :filters="filters"
        @sort-products="handleSorting"
        @filter-products="handleFiltering"
      />

      <section>
        <ul>
          <li v-for="product in filteredProducts" :key="product.ProductID">
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
