<script setup lang="ts">
  import { Product, useProducts } from "~/composables/useProducts.js";
  import FilterBar from "~/components/filter-bar.vue";
  import { Sort, getSortedProducts } from "~/utils/getSortedProducts";
  import { Filters, getFilteredProducts } from "~/utils/getProductFilters";

  const { data: products, isError, error, isLoading } = useProducts();
  const filteredProducts = ref<Product[] | undefined>();
  const filters = ref<Filters | undefined>();
  const sortOrder = ref<Sort | undefined>();

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

  // This watcher is for when a new request is coming in, that way the filters,
  // and sort orders are preserved
  watch(products, (newProducts) => {
    if (!newProducts) return;

    if (!filters.value) filters.value = getProductFilters(newProducts);

    let products = newProducts;

    if (filters.value) {
      products = getFilteredProducts(products, filters.value);
    }
    if (sortOrder.value) {
      products = getSortedProducts(products, sortOrder.value);
    }

    filteredProducts.value = products;
  });
</script>

<template>
  <span v-if="isLoading">Loading...</span>
  <span v-else-if="isError">Error: {{ (error as Error).message }}</span>
  <main v-else-if="products && filters">
    <FilterBar
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
          />
          <h1>{{ product.BrandInfo?.Description }}</h1>
          <h2>{{ product.MainDescription }}</h2>
          <p>€{{ product.ProductPrices[0].RegularPrice }}</p>

          <span class="quantity-controller">
            <button class="remove">-</button>
            <p>0</p>
            <button class="add">+</button>
          </span>
        </li>
      </ul>
    </section>
  </main>
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
