<script setup lang="ts">
  import { Product, useProducts } from "~/composables/useProducts.js";
  import FilterBar from "~/components/filter-bar.vue";
  import { Sort, getSortedProducts } from "~/utils/getSortedProducts";
  import { Filters, getFilteredProducts } from "~/utils/getProductFilters";
  import { useCartStore } from "~/stores/useCartStore";

  const {
    data: products,
    isError,
    error,
    isLoading,
    suspense: prefetchProducts,
  } = useProducts();

  const filteredProducts = useState<Product[]>("filtered-products");
  const filters = useState<Filters>("filters");
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

  onServerPrefetch(async () => {
    const { data: newProducts } = await prefetchProducts();

    if (!newProducts) return;

    const productFilters = getProductFilters(newProducts);
    filters.value = productFilters;
    filteredProducts.value = getFilteredProducts(newProducts, productFilters);
  });
</script>

<template>
  <div>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ (error as Error).message }}</span>

    <main v-else>
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
