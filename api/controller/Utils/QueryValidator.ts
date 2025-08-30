import { object, number, string, array, lazy, mixed } from "yup";

const orderInput = ["createdAt_desc", "price_desc", "price_asc", "discount_desc", "discount_asc", "rating_desc"];

const orderBySchema = mixed().transform((value, originalValue) => {
  if (typeof originalValue === "string" && orderInput.includes(originalValue)) {
    const [key, order] = originalValue.split("_");
    return { [key!]: order };
  }
  return undefined;
});

let productRequest = object({
  p: number().default(1),
  q: string().transform((value) => {
    const words = value.trim().split(/\s+/);
    return words.length > 1 ? words.join(" & ") : value.trim();
  }),
  limit: number().default(10),
  category: number(),
  subject: array(string()),
  style: array(string()),
  material: array(string()),
  collection: number(),
  rating: array(number()),
  discount: array(number()),
  sellingOption: mixed().oneOf(["ORIGINAL", "PRINT"]),
  price_range: object({ min: number(), max: number() }).default(undefined),
  order: orderBySchema,
});

let salesOrderRequest = object({
  p: number().default(1),
  q: string().transform((value) => {
    const words = value.trim().split(/\s+/);
    return words.length > 1 ? words.join(" & ") : value.trim();
  }),
  limit: number().default(10),
  sellingOption: mixed().oneOf(["ORIGINAL", "PRINT"]),
  order: orderBySchema,
  status: mixed().oneOf(["cancelled", "pending", "shipped", "delivered", "refunded"]),
});

export function QueryValidator(qry: any) {
  let options = { stripUnknown: true };
  const query = productRequest.validateSync(qry, options);
  return query;
}

export function salesOrderQueryValidator(qry: any) {
  let options = { stripUnknown: true };
  const query = salesOrderRequest.validateSync(qry, options);
  return query;
}
