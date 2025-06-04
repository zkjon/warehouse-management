"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, LayoutGrid, PlusCircle, Repeat } from 'lucide-react'; // Repeat for ArrowRightLeft

const navItems = [
  { href: '/', label: 'Inventario', icon: LayoutGrid, exact: true },
  { href: '/products/add', label: 'Añadir Producto', icon: PlusCircle },
  { href: '/stock/movements', label: 'Movimientos Stock', icon: Repeat },
  { href: '/reports', label: 'Informes', icon: FileText },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2" aria-label="Página de inicio de AlmacenControl">
              <h1 className="text-xl font-semibold font-headline group-data-[state=collapsed]:hidden group-data-[collapsible=icon]:hidden">
                AlmacenControl
              </h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-full">
              <SidebarMenu className="p-4">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
                        className="w-full justify-start"
                        tooltip={item.label}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            {/* Contenido del pie de página, ej. configuración o usuario */}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="flex items-center gap-3">
              <div className="md:hidden"> {/* Solo mostrar disparador en móvil */}
                <SidebarTrigger />
              </div>
            </div>
            <div>
              {/* Aquí podrías añadir elementos como un menú de usuario (UserNav) */}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
