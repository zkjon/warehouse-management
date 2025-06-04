"use client";

import type { StockMovement } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StockMovementsTableProps {
  movements: StockMovement[];
  maxHeight?: string;
}

export function StockMovementsTable({ movements, maxHeight = "400px" }: StockMovementsTableProps) {
  if (movements.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No stock movements recorded yet.</p>;
  }

  return (
    <ScrollArea style={{maxHeight: maxHeight}} className="rounded-md border">
      <Table>
        <TableCaption>A list of recent stock movements.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>{format(new Date(movement.date), 'PPp')}</TableCell>
              <TableCell className="font-medium">{movement.productName || movement.productId}</TableCell>
              <TableCell>
                <Badge variant={movement.type === 'entry' ? 'default' : 'secondary'}
                  className={movement.type === 'entry' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white' }
                >
                  {movement.type === 'entry' ? 'Entry (Debe)' : 'Exit (Haber)'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{movement.quantity}</TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                {movement.notes || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
