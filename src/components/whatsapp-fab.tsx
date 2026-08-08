"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { WhatsApp } from "@/components/icons";
import { company } from "@/data/company";

export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          href={company.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="group fixed right-5 bottom-5 z-40 flex h-14 items-center gap-3 rounded-full bg-[#25D366] pr-5 pl-4 text-white shadow-[0_16px_40px_-12px_rgba(37,211,102,0.75)] transition-all hover:bg-[#1eb955] md:right-7 md:bottom-7"
          aria-label="Chat with NR Life Care on WhatsApp"
        >
          <WhatsApp className="h-6 w-6 shrink-0" />
          <span className="hidden text-[14px] font-semibold sm:inline">
            Enquire on WhatsApp
          </span>
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
