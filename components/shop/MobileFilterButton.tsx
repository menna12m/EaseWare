'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FilterSidebar, ActiveFilterCount } from '@/components/shop/FilterSidebar';

export function MobileFilterButton() {
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream-50 px-4 py-2 text-sm md:hidden">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        <ActiveFilterCount />
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] overflow-y-auto p-6 sm:max-w-sm">
        <FilterSidebar />
      </SheetContent>
    </Sheet>
  );
}
