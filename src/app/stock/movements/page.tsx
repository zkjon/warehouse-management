"use client";

import { StockMovementForm } from '@/components/forms/stock-movement-form';
import { StockMovementsTable } from '@/components/tables/stock-movements-table';
import { PageHeader } from '@/components/page-header';
import type { StockMovementFormData } from '@/lib/schema';
import { useAppStore, useIsHydrated } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageSearch } from 'lucide-react';

export default function StockMovementsPage() {
  const products = useAppStore((state) => state.products);
  const stockMovements = useAppStore((state) => state.stockMovements);
  const addStockMovement = useAppStore((state) => state.addStockMovement);
  const isHydrated = useIsHydrated();
  const { toast } = useToast();

  const handleSubmit = (data: StockMovementFormData) => {
    try {
      addStockMovement(data);
      const productName = products.find(p => p.id === data.productId)?.name || 'Product';
      toast({
        title: 'Stock Movement Recorded',
        description: `${data.type === 'entry' ? 'Entry' : 'Exit'} of ${data.quantity} for ${productName} logged.`,
      });
    } catch (error: any) {
      console.error("Failed to record stock movement:", error);
      toast({
        title: 'Error Recording Movement',
        description: error.message || 'There was a problem. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (!isHydrated) {
    return <div className="flex justify-center items-center h-screen"><p>Loading data...</p></div>;
  }

  return (
    <>
      <PageHeader 
        title="Stock Movements"
        description="Record product entries and exits from your inventory."
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
                <CardTitle className="font-headline">No Products Available</CardTitle>
                <CardDescription>
                  You need to add products to your inventory before you can record stock movements.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                 <a href="/products/add">
                  <Button>Add Products</Button>
                </a>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Recent Movements</CardTitle>
              <CardDescription>A log of the latest stock activities.</CardDescription>
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
