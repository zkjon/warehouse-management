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
        currentStock: product.quantity, // This is the source of truth from product state
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        totalPurchaseValue: product.purchasePrice * product.quantity,
        totalSaleValuePotential: product.salePrice * product.quantity,
      };
    }).sort((a,b) => a.productName.localeCompare(b.productName));
  }, [products, stockMovements, isHydrated]);

  const handleExport = () => {
    if (reportData.length > 0) {
      // Select and rename columns for export
      const exportableData = reportData.map(row => ({
        "Product Name": row.productName,
        "Current Stock": row.currentStock,
        "Total Entries": row.totalEntries,
        "Total Exits": row.totalExits,
        "Purchase Price": row.purchasePrice.toFixed(2),
        "Sale Price": row.salePrice.toFixed(2),
        "Total Purchase Value": row.totalPurchaseValue.toFixed(2),
        "Potential Sale Value": row.totalSaleValuePotential.toFixed(2),
      }));
      exportToCsv('almacen_control_report.csv', exportableData);
    } else {
      alert("No data to export.");
    }
  };

  if (!isHydrated) {
    return <div className="flex justify-center items-center h-screen"><p>Loading report data...</p></div>;
  }

  return (
    <>
      <PageHeader 
        title="Inventory Report"
        description="A comprehensive summary of your product inventory, stock movements, and values."
        action={
          <Button onClick={handleExport} disabled={reportData.length === 0}>
            <Download className="mr-2 h-4 w-4" /> Export Report (CSV)
          </Button>
        }
      />
      {reportData.length === 0 ? (
         <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-secondary/10 p-3 rounded-full mb-2 w-fit">
                <PackageSearch className="h-10 w-10 text-secondary" />
            </div>
            <CardTitle className="font-headline">Report is Empty</CardTitle>
            <CardDescription>There are no products or stock movements to generate a report. Add some products and record movements first.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Stock Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportTable reportData={reportData} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
