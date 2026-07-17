"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"

// Keyed by pathname so each route change gets its own enter/exit instead of
// content just snapping in — the difference between "an app" and "a page
// that reloaded its contents".
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
