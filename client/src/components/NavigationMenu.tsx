"use client"

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", text: "Mapa" },
  { href: "/tags", text: "Tags" },
  { href: "/new/subsidiary", text: "Filial" },
  { href: "/new/yard", text: "Pátio" },
  { href: "/new/camera", text: "Câmera" },
];

export default function Navigation() {
  const pathname = usePathname() || "/";

  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-lg font-semibold">Tracer</span>
            </Link>

            <nav>
              <NavigationMenu>
                <NavigationMenuList className="flex items-center space-x-1">
                  {links.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);

                    return (
                      <NavigationMenuItem key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            className={
                              "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium " +
                              (isActive
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent/10")
                            }
                          >
                            {link.text}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}