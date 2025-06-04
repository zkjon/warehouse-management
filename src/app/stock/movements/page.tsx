"use client";

import { StockMovementForm } from '@/components/forms/stock-movement-form';
import { StockMovementsTable } from '@/components/tables/stock-movements-table';
import { PageHeader } from '@/components/page-header';
import type { StockMovementFormData } from '@/lib/schema';
import { useAppStore, useIsHydrated } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StockMovementsPage() {
  const products = useAppStore((state) => state.products);
  const stockMovements = useAppStore((state) => state.stockMovements);
  const addStockMovement = useAppStore((state) => state.addStockMovement);
  const isHydrated = useIsHydrated();
  const { toast } = useToast();

  const handleSubmit = (data: StockMovementFormData) => {
    try {
      addStockMovement(data);
      const productName = products.find(p => p.id === data.productId)?.name || 'Producto';
      toast({
        title: 'Movimiento de Stock Registrado',
        description: `${data.type === 'entry' ? 'Entrada' : 'Salida'} de ${data.quantity} para ${productName} registrada.`,
      });
    } catch (error: any) {
      console.error("Error al registrar movimiento de stock:", error);
      toast({
        title: 'Error al Registrar Movimiento',
        description: error.message || 'Hubo un problema. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };
  
  if (!isHydrated) {
    return <div className="flex justify-center items-center h-screen"><p>Cargando datos...</p></div>;
  }

  return (
    <>
      <PageHeader 
        title="Movimientos de Stock"
        description="Registra entradas y salidas de productos de tu inventario."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {products.length > 0 ? (
            <StockMovementForm products={products} onSubmit={handleSubmit} />
          ) : (
            <Card>
              <CardHeader className="text-center">
                 <div className="mx-auto bg-secondary/10 p-3 rounded-full mb-2 w-fit">
                    <PackageSearch className="h-10 w-10 text-secondary" />
                  </div>
                <CardTitle className="font-headline">No Hay Productos Disponibles</CardTitle>
                <CardDescription>
                  Necesitas añadir productos a tu inventario antes de poder registrar movimientos de stock.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                 <Link href="/products/add" passHref>
                  <Button>Añadir Productos</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Movimientos Recientes</CardTitle>
              <CardDescription>Un registro de las últimas actividades de stock.</CardDescription>
            </CardHeader>
            <CardContent>
              <StockMovementsTable movements={stockMovements} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
