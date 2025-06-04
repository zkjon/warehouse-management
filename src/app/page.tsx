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

export default function InventoryPage() {
  const products = useAppStore((state) => state.products);
  const deleteProduct = useAppStore((state) => state.deleteProduct);
  const isHydrated = useIsHydrated();
  const { toast } = useToast();

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    toast({
      title: "Product Deleted",
      description: "The product and its associated stock movements have been removed.",
    });
  };

  if (!isHydrated) {
    return <div className="flex justify-center items-center h-screen"><p>Loading inventory...</p></div>;
  }

  const calculateTotalValue = (price: number, quantity: number) => price * quantity;

  return (
    <>
      <PageHeader 
        title="Inventory Overview"
        description="Manage and view your current product stock."
        action={
          <Link href="/products/add" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
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
            <CardTitle className="font-headline">No Products Yet</CardTitle>
            <CardDescription>Start by adding your first product to the inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products/add" passHref>
              <Button size="lg">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Current Stock</CardTitle>
            <CardDescription>
              A list of all products currently in your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Purchase Price</TableHead>
                  <TableHead className="text-right">Sale Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total Purchase Value</TableHead>
                  <TableHead className="text-right">Total Sale Value</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {product.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">${product.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${product.salePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">
                      ${calculateTotalValue(product.purchasePrice, product.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${calculateTotalValue(product.salePrice, product.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>{format(new Date(product.updatedAt), 'PPp')}</TableCell>
                    <TableCell className="text-right">
                       <Link href={`/products/add?edit=${product.id}`} passHref>
                        <Button variant="ghost" size="icon" className="mr-2 hover:text-primary">
                          <Edit3 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the product
                              and all associated stock movements.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
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
