"use client"
import { Accordion } from "@ark-ui/react/accordion"
import { ChevronDownIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface AccordionItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  items: AccordionItem[]
  defaultOpen?: string
}

export function FaqAccordion({ items, defaultOpen }: FaqAccordionProps) {
  return (
    <Accordion.Root
      defaultValue={defaultOpen ? [defaultOpen] : []}
      className="w-full"
    >
      {items.map((item, i) => (
        <Accordion.Item
          key={i}
          value={item.q}
          className="border-b last:border-none border-zinc-100"
        >
          <Accordion.ItemTrigger className="group flex items-center justify-between w-full py-4 px-1 text-left text-sm font-medium text-zinc-900 hover:text-indigo-600 transition-colors sm:text-base">
            <span>{item.q}</span>
            <Accordion.ItemIndicator>
              <ChevronDownIcon className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-indigo-500 sm:h-5 sm:w-5" />
            </Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent asChild>
            <AnimatePresence initial={false}>
              <motion.div
                key={item.q}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-1 pb-4 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                  {item.a}
                </p>
              </motion.div>
            </AnimatePresence>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
