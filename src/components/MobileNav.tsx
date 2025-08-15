"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  isAuth: boolean;
}

const MobileNav: FC<MobileNavProps> = ({ isAuth }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname() ?? "";
  const menuRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((s) => !s);

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onClickOutside = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen]);

  const handleLinkClick = () => {
    close();
  };

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={toggle}
        className="relative z-50 inline-flex items-center justify-center p-2"
      >
        <Menu className="h-5 w-5 text-zinc-700" />
      </button>

      {isOpen ? (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 animate-in slide-in-from-top-5 fade-in-20 w-full"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/20"
            onClick={close}
            aria-hidden="true"
          />

          <ul className="relative z-50 mx-auto mt-16 w-full max-w-lg gap-3 rounded-b-2xl bg-white px-10 pt-6 pb-8 shadow-xl dark:bg-black/95 border-b border-zinc-200">
            {!isAuth ? (
              <>
                <li>
                  <Link
                    href="/sign-up"
                    onClick={handleLinkClick}
                    className="flex items-center font-semibold text-green-600"
                  >
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>

                <li className="my-3 h-px w-full bg-gray-300 dark:bg-zinc-800" />

                <li>
                  <Link
                    href="/sign-in"
                    onClick={handleLinkClick}
                    className="flex items-center font-semibold"
                  >
                    Sign in
                  </Link>
                </li>

                <li className="my-3 h-px w-full bg-gray-300 dark:bg-zinc-800" />

                <li>
                  <Link
                    href="/pricing"
                    onClick={handleLinkClick}
                    className="flex items-center font-semibold"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center font-semibold"
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="my-3 h-px w-full bg-gray-300 dark:bg-zinc-800" />

                <li>
                  <Link
                    href="/sign-out"
                    onClick={handleLinkClick}
                    className="flex items-center font-semibold dark:text-white"
                  >
                    Sign out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
