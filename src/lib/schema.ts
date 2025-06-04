import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, { message: "El nombre del producto es obligatorio." }).max(100, { message: "El nombre del producto no puede exceder los 100 caracteres." }),
  description: z.string().max(500, { message: "La descripción no puede exceder los 500 caracteres." }).optional().or(z.literal('')),
  purchasePrice: z.coerce.number().min(0, { message: "El precio de compra debe ser no negativo." }),
  salePrice: z.coerce.number().min(0, { message: "El precio de venta debe ser no negativo." }),
  quantity: z.coerce.number().int({ message: "La cantidad debe ser un número entero." }).min(0, { message: "La cantidad debe ser no negativa." }),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const stockMovementSchema = z.object({
  productId: z.string().min(1, { message: "La selección del producto es obligatoria." }),
  type: z.enum(['entry', 'exit'], { required_error: "El tipo de movimiento es obligatorio." }),
  quantity: z.coerce.number().int({ message: "La cantidad debe ser un número entero." }).min(1, { message: "La cantidad debe ser al menos 1." }),
  date: z.date({ required_error: "La fecha es obligatoria." }),
  notes: z.string().max(200, { message: "Las notas no pueden exceder los 200 caracteres." }).optional().or(z.literal('')),
});

export type StockMovementFormData = z.infer<typeof stockMovementSchema>;
