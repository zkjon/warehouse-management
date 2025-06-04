
"use client";

import { useAppStore, useIsHydrated } from '@/store';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { PlusCircle, Edit3, Trash2, PackageSearch } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrencyEuro } from '@/lib/utils';

export default function InventoryPage() {
  const products = useAppStore((state) => state.products);
  const deleteProduct = useAppStore((state) => state.deleteProduct);
  const isHydrated = useIsHydrated();
  const { toast } = useToast();

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    toast({
      title: "Producto Eliminado",
      description: "El producto y sus movimientos de stock asociados han sido eliminados.",
    });
  };

  if (!isHydrated) {
    return <div className="flex justify-center items-center h-screen"><p>Cargando inventario...</p></div>;
  }

  const calculateTotalValue = (price: number, quantity: number) => price * quantity;

  return (
    <>
      <PageHeader 
        title="Resumen de Inventario"
        description="Gestiona y visualiza el stock actual de tus productos."
        action={
          <Link href="/products/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Producto
            </Button>
          </Link>
        }
      />
      
      {products.length === 0 ? (
        <Card className="text-center">
          <CardHeader>
             <div className="mx-auto bg-secondary/10 p-3 rounded-full mb-2 w-fit">
                <PackageSearch className="h-10 w-10 text-secondary" />
              </div>
            <CardTitle className="font-headline">Aún No Hay Productos</CardTitle>
            <CardDescription>Comienza añadiendo tu primer producto al inventario.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products/add" passHref>
              <Button size="lg">
                <PlusCircle className="mr-2 h-5 w-5" /> Añadir Producto
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Stock Actual</CardTitle>
            <CardDescription>
              Un listado de todos los productos actualmente en tu inventario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Precio Compra</TableHead>
                  <TableHead className="text-right">Precio Venta</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Valor Total Compra</TableHead>
                  <TableHead className="text-right">Valor Total Venta</TableHead>
                  <TableHead>Última Actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {product.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrencyEuro(product.purchasePrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrencyEuro(product.salePrice)}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrencyEuro(calculateTotalValue(product.purchasePrice, product.quantity))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrencyEuro(calculateTotalValue(product.salePrice, product.quantity))}
                    </TableCell>
                    <TableCell>{format(new Date(product.updatedAt), 'PPp', { locale: es })}</TableCell>
                    <TableCell className="text-right">
                       <Link href={`/products/add?edit=${product.id}`} passHref>
                        <Button variant="ghost" size="icon" className="mr-2 hover:text-primary">
                          <Edit3 className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
                              y todos los movimientos de stock asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
