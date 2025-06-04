"use client";

import type { Product, StockMovement } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    return <p className="text-muted-foreground text-center py-4">No data available for the report.</p>;
  }

  return (
    <ScrollArea style={{maxHeight: maxHeight}} className="rounded-md border">
      <Table>
        <TableCaption>Summary of product stock levels, entries, and exits.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead className="text-right">Total Entries (Debe)</TableHead>
            <TableHead className="text-right">Total Exits (Haber)</TableHead>
            <TableHead className="text-right">Current Stock</TableHead>
            <TableHead className="text-right">Purchase Price</TableHead>
            <TableHead className="text-right">Sale Price</TableHead>
            <TableHead className="text-right">Total Purchase Value</TableHead>
            <TableHead className="text-right">Total Sale Value (Potential)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.map((row) => (
            <TableRow key={row.productId}>
              <TableCell className="font-medium">{row.productName}</TableCell>
              <TableCell className="text-right">{row.totalEntries}</TableCell>
              <TableCell className="text-right">{row.totalExits}</TableCell>
              <TableCell className="text-right font-semibold">{row.currentStock}</TableCell>
              <TableCell className="text-right">${row.purchasePrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">${row.salePrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">${row.totalPurchaseValue.toFixed(2)}</TableCell>
              <TableCell className="text-right">${row.totalSaleValuePotential.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
