import { z } from 'zod'

export const productInProductsSchema = z
  .object({
    product_id: z.string(),
    sku: z.string(),
    products: z.array(z.object({ product_id: z.string(), sku: z.string() })),
  })
  .refine(
    (event) => {
      const productInCart = (event.products as Array<object>).find(
        (p: { product_id: string; sku: string }) => {
          return p.product_id === event.product_id && p.sku === event.sku
        }
      )
      return !!productInCart
    },
    {
      message: '`products` array must contain the product_id and sku provided',
    }
  )
