import { z } from "zod"

export const customerDataSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),

  phone: z
    .string()
    .min(10, "Telefone inválido")
    .max(15, "Telefone inválido")
    .regex(/^[\d\s$$$$\-+]+$/, "Formato de telefone inválido"),

  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres").max(500, "Endereço muito longo").optional(),

  deliveryType: z.enum(["delivery", "pickup"]),

  paymentMethod: z.enum(["money", "card", "pix"]),

  observations: z.string().max(500, "Observações muito longas").optional(),
})

export const cartItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  quantity: z.number().int().positive().max(10),
  observations: z.string().max(200).optional(),
})

export type CustomerData = z.infer<typeof customerDataSchema>
export type CartItem = z.infer<typeof cartItemSchema>
