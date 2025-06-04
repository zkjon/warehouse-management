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
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Boxes, FileText, LayoutGrid, PlusCircle, Repeat, Settings } from 'lucide-react'; // Repeat for ArrowRightLeft

const navItems = [
  { href: '/', label: 'Inventory', icon: LayoutGrid, exact: true },
  { href: '/products/add', label: 'Add Product', icon: PlusCircle },
  { href: '/stock/movements', label: 'Stock Movements', icon: Repeat },
  { href: '/reports', label: 'Reports', icon: FileText },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-semibold font-headline">AlmacenControl</h1>
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
            {/* Footer content, e.g. settings or user */}
            {/* <SidebarMenuButton className="w-full justify-start">
              <Settings className="mr-2 h-5 w-5" />
              <span>Settings</span>
            </SidebarMenuButton> */}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="md:hidden"> {/* Only show trigger on mobile */}
              <SidebarTrigger />
            </div>
            <div className="flex-1 text-center md:text-left">
              {/* Can add page title here dynamically or breadcrumbs */}
            </div>
            {/* Add UserNav or other header items here if needed */}
          </header>
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
