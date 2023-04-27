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

export type Filters = ReturnType<typeof getProductFilters>;
