import * as React from "react";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";

const links = [
  {
    href: "/",
    text: "Mapa 2D",
  },
  {
    href: "/tags",
    text: "Reconhecer Tags",
  },
  {
    href: "/new/subsidiary",
    text: "Nova Filial",
  },
  {
    href: "/new/yard",
    text: "Novo Pátio",
  },
  {
    href: "/new/camera",
    text: "Nova Câmera",
  },
];

export default function Navigation() {
  return (
    <NavigationMenu className="p-4" viewport={false}>
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink asChild>
              <Link href={link.href}>{link.text}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
