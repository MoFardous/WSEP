
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  BarChart3, 
  Activity, 
  Users, 
  AlertTriangle, 
  Database, 
  Home,
  Upload 
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from 'lucide-react';

const navigation = [
  {
    name: 'الرئيسية',
    href: '/',
    icon: Home,
  },
  {
    name: 'الأنشطة',
    href: '/activities',
    icon: Activity,
  },
  {
    name: 'أعمال الدعم',
    href: '/support',
    icon: Users,
  },
  {
    name: 'المخاطر والتحديات',
    href: '/risks',
    icon: AlertTriangle,
  },
  {
    name: 'مزامنة البيانات',
    href: '/data-sync',
    icon: Database,
  },
  {
    name: 'رفع البيانات',
    href: '/data-upload',
    icon: Upload,
  },
];

export function Navbar() {
  const pathname = usePathname();

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size={mobile ? "default" : "sm"}
              className={cn(
                "w-full justify-start gap-2 font-medium",
                mobile && "justify-center",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 space-x-reverse">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">لوحة التحكم الإدارية</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
          <NavItems />
        </nav>

        {/* Theme Toggle & Mobile Menu */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <ThemeToggle />
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <NavItems mobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
