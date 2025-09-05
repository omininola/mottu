import * as React from "react";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

export default function Navigation() {
  return (
    <NavigationMenu className="p-4" viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/">Mapa 2D</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/tags">Reconhecer Tags</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Criar</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-28">
              <NavigationMenuLink asChild>
                <Link href="/new/subsidiary">Nova Filial</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link href="/new/yard">Novo Pátio</Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
