"use client";

import type { StockMovement } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Import Spanish locale
import { ScrollArea } from '@/components/ui/scroll-area';

interface StockMovementsTableProps {
  movements: StockMovement[];
  maxHeight?: string;
}

export function StockMovementsTable({ movements, maxHeight = "400px" }: StockMovementsTableProps) {
  if (movements.length === 0) {
    return <p className="text-muted-foreground text-center py-4">Aún no se han registrado movimientos de stock.</p>;
  }

  return (
    <ScrollArea style={{maxHeight: maxHeight}} className="rounded-md border">
      <Table>
        <TableCaption>Un listado de los movimientos de stock recientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Notas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>{format(new Date(movement.date), 'PPp', { locale: es })}</TableCell>
              <TableCell className="font-medium">{movement.productName || movement.productId}</TableCell>
              <TableCell>
                <Badge variant={movement.type === 'entry' ? 'default' : 'secondary'}
                  className={movement.type === 'entry' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white' }
                >
                  {movement.type === 'entry' ? 'Entrada (Debe)' : 'Salida (Haber)'}
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
