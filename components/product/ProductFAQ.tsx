'use client';

import type { FAQ } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function ProductFAQ({ faqs }: { faqs: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-ink md:text-3xl">Questions, answered</h2>
      <Accordion type="single" collapsible className="mt-4">
        {faqs.map((f) => (
          <AccordionItem key={f.id} value={String(f.id)}>
            <AccordionTrigger>{f.question}</AccordionTrigger>
            <AccordionContent>
              <p className="leading-relaxed">{f.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
