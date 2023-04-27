<script setup lang="ts">
  import { useProducts } from "~/composables/useProducts.js";
  import FilterBar from "~/components/filter-bar.vue";
  import { Filters } from "~/utils/getProductFilters";

  const { data: products, isError, error, isLoading } = useProducts();

  const filteredProducts = ref(products.value);
  watch(products, () => (filteredProducts.value = products.value));

  const handleFilters = (filters: Filters) => {
    const activeFilters = filters.map((filter) => ({
      ...filter,
      options: filter.options.filter((opt) => opt.checked),
    }));

    const anOfferIsSelected = activeFilters
      .find((filter) => filter.id === "offers")
      ?.options.some((opt) => opt.checked);

    const filtered = products.value?.filter((product) => {
      const getActive = (id: string) =>
        activeFilters
          .find((filter) => filter.id === id)
          ?.options.map((opt) => opt.value);

      const productBrandId = product.BrandInfo?.BrandID;
      const productGroupIds = product.WebSubGroups.map(
        (group) => group.WebSubGroupID
      );
      const productOfferIds = product.ProductOffers.map(
        (offer) => offer.Offer.OfferID
      );

      const productBrandIsActive = productBrandId
        ? getActive("brands")?.includes(productBrandId)
        : undefined;

      const productGroupIsActive = getActive("groups")?.some((activeId) =>
        productGroupIds.includes(activeId)
      );

      const productOfferIsActive = getActive("offers")?.some((activeId) =>
        productOfferIds.includes(activeId)
      );

      if (anOfferIsSelected && productOfferIsActive) return true;

      if (!anOfferIsSelected && productBrandIsActive && productGroupIsActive)
        return true;
    });

    filteredProducts.value = filtered;
  };
</script>

<template>
  <span v-if="isLoading">Loading...</span>
  <span v-else-if="isError">Error: {{ (error as Error).message }}</span>
  <main v-else-if="products">
    <FilterBar :products="products" @set-filter="handleFilters" />
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
