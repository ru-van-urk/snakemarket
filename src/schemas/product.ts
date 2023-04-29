import { z } from "zod";

export const productSchema = z.object({
  ProductID: z.number(),
  MainDescription: z.string(),
  BrandInfo: z
    .object({
      BrandID: z.number(),
      Description: z.string(),
    })
    .nullable(),
  WebSubGroups: z.array(
    z.object({ WebSubGroupID: z.number(), Description: z.string() })
  ),
  ProductOffers: z.array(
    z.object({
      Offer: z.object({
        OfferID: z.number(),
        HeaderText: z.string(),
      }),
    })
  ),
  ProductPrices: z.array(z.object({ RegularPrice: z.number() })),
  ProductPictures: z.array(
    z.object({
      Url: z.string(),
      IsPrimary: z.boolean(),
    })
  ),
});

export type Product = z.infer<typeof productSchema>;
