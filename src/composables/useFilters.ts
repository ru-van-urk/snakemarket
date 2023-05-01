import { useNuxtData, useState } from "nuxt/app";
import { Product } from "~/schemas/product";

const getProductFilterOptions = (products: Product[]) => {
  const uniqueBrands = products
    .map((product) => product.BrandInfo)
    .filter(Boolean)
    .filter(
      (product, index, self) =>
        self.findIndex((prod) => prod.BrandID === product.BrandID) === index
    )
    .sort((a, b) => a.Description.localeCompare(b.Description))
    .map((brand) => ({
      value: brand.BrandID,
      label: brand.Description,
      checked: false,
    }));

  const uniqueWebSubGroups = products
    .flatMap((product) => product.WebSubGroups)
    .filter(
      (product, index, self) =>
        self.findIndex(
          (prod) => prod.WebSubGroupID === product.WebSubGroupID
        ) === index
    )
    .sort((a, b) => a.Description.localeCompare(b.Description))
    .map((group) => ({
      value: group.WebSubGroupID,
      label: group.Description,
      checked: false,
    }));

  const uniqueOffers = products
    .flatMap((product) => product.ProductOffers)
    .map((product) => product.Offer)
    .filter(
      (offer, index, self) => self.findIndex((off) => off === offer) === index
    )
    .sort((a, b) => a.HeaderText.localeCompare(b.HeaderText))
    .map((offer) => ({
      value: offer.OfferID,
      label: offer.HeaderText,
      checked: false,
    }));

  return [
    {
      id: "brands",
      name: "Merk",
      options: uniqueBrands,
    },
    {
      id: "groups",
      name: "Groep",
      options: uniqueWebSubGroups,
    },
    {
      id: "offers",
      name: "Aanbieding",
      options: uniqueOffers,
    },
  ] as const;
};

type FilterId = "brands" | "groups" | "offers";

const useFilters = () => {
  const products = useNuxtData<Product[]>("products").data.value;

  const activeFilters = useState("filters", () =>
    getProductFilterOptions(products ?? [])
  );

  const filterFn = (product: Product) => {
    if (!activeFilters.value) return false;

    const filters = activeFilters.value.map((filter) => ({
      ...filter,
      options: filter.options.filter((opt) => opt.checked),
    }));

    // When no filters are active show all the products
    if (filters.every((filter) => filter.options.length === 0)) {
      return true;
    }

    const getActive = (id: FilterId) =>
      filters
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

    if (productBrandIsActive || productOfferIsActive || productGroupIsActive)
      return true;
  };

  return { activeFilters, filterFn } as const;
};

export default useFilters;
