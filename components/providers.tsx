'use client';

import * as React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';

import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/lib/hooks/use-sidebar';

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SidebarProvider>
        <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
      </SidebarProvider>
    </NextThemesProvider>
  );
}
