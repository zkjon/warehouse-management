import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }).max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  purchasePrice: z.coerce.number().min(0, { message: "Purchase price must be non-negative." }),
  salePrice: z.coerce.number().min(0, { message: "Sale price must be non-negative." }),
  quantity: z.coerce.number().int({ message: "Quantity must be an integer." }).min(0, { message: "Quantity must be non-negative." }),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const stockMovementSchema = z.object({
  productId: z.string().min(1, { message: "Product selection is required." }),
  type: z.enum(['entry', 'exit'], { required_error: "Movement type is required." }),
  quantity: z.coerce.number().int({ message: "Quantity must be an integer." }).min(1, { message: "Quantity must be at least 1." }),
  date: z.date({ required_error: "Date is required." }),
  notes: z.string().max(200).optional().or(z.literal('')),
});

export type StockMovementFormData = z.infer<typeof stockMovementSchema>;
