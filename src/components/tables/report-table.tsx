
"use client";

import type { Product, StockMovement } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrencyEuro } from '@/lib/utils';

export interface ReportRow {
  productId: string;
  productName: string;
  totalEntries: number;
  totalExits: number;
  currentStock: number;
  purchasePrice: number;
  salePrice: number;
  totalPurchaseValue: number;
  totalSaleValuePotential: number;
}

interface ReportTableProps {
  reportData: ReportRow[];
  maxHeight?: string;
}

export function ReportTable({ reportData, maxHeight = "600px" }: ReportTableProps) {
  if (reportData.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No hay datos disponibles para el informe.</p>;
  }

  return (
    <ScrollArea style={{maxHeight: maxHeight}} className="rounded-md border">
      <Table>
        <TableCaption>Resumen de los niveles de stock de productos, entradas y salidas.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre Producto</TableHead>
            <TableHead className="text-right">Entradas Totales (Debe)</TableHead>
            <TableHead className="text-right">Salidas Totales (Haber)</TableHead>
            <TableHead className="text-right">Stock Actual</TableHead>
            <TableHead className="text-right">Precio Compra</TableHead>
            <TableHead className="text-right">Precio Venta</TableHead>
            <TableHead className="text-right">Valor Total Compra</TableHead>
            <TableHead className="text-right">Valor Total Venta (Potencial)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.map((row) => (
            <TableRow key={row.productId}>
              <TableCell className="font-medium">{row.productName}</TableCell>
              <TableCell className="text-right">{row.totalEntries}</TableCell>
              <TableCell className="text-right">{row.totalExits}</TableCell>
              <TableCell className="text-right font-semibold">{row.currentStock}</TableCell>
              <TableCell className="text-right">{formatCurrencyEuro(row.purchasePrice)}</TableCell>
              <TableCell className="text-right">{formatCurrencyEuro(row.salePrice)}</TableCell>
              <TableCell className="text-right">{formatCurrencyEuro(row.totalPurchaseValue)}</TableCell>
              <TableCell className="text-right">{formatCurrencyEuro(row.totalSaleValuePotential)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
