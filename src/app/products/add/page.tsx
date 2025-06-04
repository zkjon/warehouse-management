"use client";

import { ProductForm } from '@/components/forms/product-form';
import { PageHeader } from '@/components/page-header';
import type { ProductFormData } from '@/lib/schema';
import { useAppStore, useIsHydrated } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Product } from '@/types';

export default function AddProductPage() {
  const addProduct = useAppStore((state) => state.addProduct);
  const updateProduct = useAppStore((state) => state.updateProduct);
  const getProductById = useAppStore((state) => state.getProductById);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHydrated = useIsHydrated();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      const productId = searchParams.get('edit');
      if (productId) {
        const product = getProductById(productId);
        if (product) {
          setEditingProduct(product);
          setIsEditing(true);
        } else {
          toast({ title: "Error", description: "Product to edit not found.", variant: "destructive" });
          router.push('/products/add'); // Go back to add mode
        }
      } else {
        setEditingProduct(null);
        setIsEditing(false);
      }
    }
  }, [searchParams, getProductById, toast, router, isHydrated]);


  const handleSubmit = (data: ProductFormData) => {
    try {
      if (isEditing && editingProduct) {
        // For editing, we don't update quantity directly via this form.
        // Quantity is managed by stock movements. We only update other details.
        const { quantity, ...updateData } = data;
        updateProduct(editingProduct.id, updateData);
        toast({
          title: 'Product Updated',
          description: `${data.name} has been successfully updated.`,
        });
      } else {
        addProduct(data);
        toast({
          title: 'Product Added',
          description: `${data.name} has been successfully added to your inventory.`,
        });
      }
      router.push('/'); // Navigate to inventory page after submission
    } catch (error) {
      console.error("Failed to submit product:", error);
      toast({
        title: 'Error',
        description: 'There was a problem saving the product. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (!isHydrated && searchParams.get('edit')) {
    // Prevent form rendering with potentially incorrect state if editing and not hydrated
    return <div className="flex justify-center items-center h-screen"><p>Loading product data...</p></div>;
  }

  return (
    <>
      <PageHeader 
        title={isEditing ? "Edit Product" : "Add New Product"}
        description={isEditing ? "Update product details." : "Enter the information for a new product."}
      />
      <ProductForm onSubmit={handleSubmit} initialData={editingProduct} isEditing={isEditing} />
    </>
  );
}
