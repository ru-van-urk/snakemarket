import { Product } from "~/composables/useProducts";

export const getProductFilters = (products: Product[]) => {
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
      checked: true,
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
      checked: true,
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

export type FilterId = "brands" | "groups" | "offers";
export type Filters = ReturnType<typeof getProductFilters>;

export const getFilteredProducts = (
  products: Product[],
  newFilters: Filters
) => {
  const activeFilters = newFilters.map((filter) => ({
    ...filter,
    options: filter.options.filter((opt) => opt.checked),
  }));

  const anOfferIsSelected = activeFilters
    .find((filter) => filter.id === "offers")
    ?.options.some((opt) => opt.checked);

  const filteredProducts = products.filter((product) => {
    const getActive = (id: FilterId) =>
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

  return filteredProducts;
};
