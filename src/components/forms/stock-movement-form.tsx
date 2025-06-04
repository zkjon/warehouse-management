"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { StockMovementFormData } from '@/lib/schema';
import { stockMovementSchema } from '@/lib/schema';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Import Spanish locale
import { CalendarIcon, Save } from 'lucide-react';
import type { Product } from '@/types';

interface StockMovementFormProps {
  products: Product[];
  onSubmit: (data: StockMovementFormData) => void;
}

export function StockMovementForm({ products, onSubmit }: StockMovementFormProps) {
  const form = useForm<StockMovementFormData>({
    resolver: zodResolver(stockMovementSchema),
    defaultValues: {
      productId: '',
      type: 'entry',
      quantity: 1,
      date: new Date(),
      notes: '',
    },
  });

  const handleSubmit = (data: StockMovementFormData) => {
    const product = products.find(p => p.id === data.productId);
    if (data.type === 'exit' && product && data.quantity > product.quantity) {
        form.setError("quantity", { type: "manual", message: `No se puede sacar más que el stock disponible (${product.quantity}).` });
        return;
    }
    onSubmit(data);
    form.reset({
      ...form.getValues(), 
      productId: data.productId, 
      quantity: 1, 
      notes: '', 
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">Registrar Movimiento de Stock</CardTitle>
        <CardDescription>Registra entradas (debe) o salidas (haber) para tus productos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un producto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (Stock: {product.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Movimiento</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="entry" />
                        </FormControl>
                        <FormLabel className="font-normal">Entrada (Debe / Compra / Ingreso)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="exit" />
                        </FormControl>
                        <FormLabel className="font-normal">Salida (Haber / Venta / Egreso)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} min="1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha del Movimiento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP', { locale: es }) : <span>Elige una fecha</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                        locale={es} // Add locale here
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ej., Info del proveedor, motivo del ajuste" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Registrar Movimiento
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
