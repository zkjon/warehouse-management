"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ProductFormData } from '@/lib/schema';
import { productSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Product } from '@/types';
import { Save } from 'lucide-react';

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  initialData?: Product | null;
  isEditing?: boolean;
}

export function ProductForm({ onSubmit, initialData, isEditing = false }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          purchasePrice: initialData.purchasePrice,
          salePrice: initialData.salePrice,
          quantity: initialData.quantity,
        }
      : {
          name: '',
          description: '',
          purchasePrice: 0,
          salePrice: 0,
          quantity: 0,
        },
  });

  const handleSubmit = (data: ProductFormData) => {
    onSubmit(data);
    if (!isEditing) {
      form.reset(); // Resetear formulario solo si se añade nuevo, no si se edita
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Actualiza los detalles del producto existente.' : 'Rellena los detalles para añadir un nuevo producto a tu inventario.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="ej., Granos de Café" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción detallada del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de Compra (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de Venta (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad Inicial</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" placeholder="0" {...field} disabled={isEditing} />
                  </FormControl>
                  {isEditing && <FormDescription>La cantidad se gestiona mediante Movimientos de Stock para productos existentes.</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Guardar Cambios' : 'Añadir Producto'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
