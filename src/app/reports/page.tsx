"use client";

import { useMemo } from 'react';
import { useAppStore, useIsHydrated } from '@/store';
import type { ReportRow } from '@/components/tables/report-table';
import { ReportTable } from '@/components/tables/report-table';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { exportToCsv } from '@/lib/utils';
import { PackageSearch } from 'lucide-react';

export default function ReportsPage() {
  const products = useAppStore((state) => state.products);
  const stockMovements = useAppStore((state) => state.stockMovements);
  const isHydrated = useIsHydrated();

  const reportData = useMemo((): ReportRow[] => {
    if (!isHydrated) return [];
    return products.map(product => {
      const movementsForProduct = stockMovements.filter(m => m.productId === product.id);
      const totalEntries = movementsForProduct
        .filter(m => m.type === 'entry')
        .reduce((sum, m) => sum + m.quantity, 0);
      const totalExits = movementsForProduct
        .filter(m => m.type === 'exit')
        .reduce((sum, m) => sum + m.quantity, 0);
      
      return {
        productId: product.id,
        productName: product.name,
        totalEntries,
        totalExits,
        currentStock: product.quantity, // Esta es la fuente de verdad del estado del producto
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        totalPurchaseValue: product.purchasePrice * product.quantity,
        totalSaleValuePotential: product.salePrice * product.quantity,
      };
    }).sort((a,b) => a.productName.localeCompare(b.productName));
  }, [products, stockMovements, isHydrated]);

  const handleExport = () => {
    if (reportData.length > 0) {
      // Seleccionar y renombrar columnas para la exportación
      const exportableData = reportData.map(row => ({
        "Nombre Producto": row.productName,
        "Stock Actual": row.currentStock,
        "Entradas Totales": row.totalEntries,
        "Salidas Totales": row.totalExits,
        "Precio Compra": row.purchasePrice.toFixed(2),
        "Precio Venta": row.salePrice.toFixed(2),
        "Valor Total Compra": row.totalPurchaseValue.toFixed(2),
        "Valor Venta Potencial": row.totalSaleValuePotential.toFixed(2),
      }));
      exportToCsv('informe_almacen_control.csv', exportableData);
    } else {
      alert("No hay datos para exportar.");
    }
  };

  if (!isHydrated) {
    return <div className="flex justify-center items-center h-screen"><p>Cargando datos del informe...</p></div>;
  }

  return (
    <>
      <PageHeader 
        title="Informe de Inventario"
        description="Un resumen completo del inventario de tus productos, movimientos de stock y valores."
        action={
          <Button onClick={handleExport} disabled={reportData.length === 0}>
            <Download className="mr-2 h-4 w-4" /> Exportar Informe (CSV)
          </Button>
        }
      />
      {reportData.length === 0 ? (
         <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-secondary/10 p-3 rounded-full mb-2 w-fit">
                <PackageSearch className="h-10 w-10 text-secondary" />
            </div>
            <CardTitle className="font-headline">El Informe está Vacío</CardTitle>
            <CardDescription>No hay productos ni movimientos de stock para generar un informe. Añade algunos productos y registra movimientos primero.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Informe Detallado de Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportTable reportData={reportData} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
