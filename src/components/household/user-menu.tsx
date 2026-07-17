"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { memberColorVar } from "@/lib/memberColors"

const MENU_LINKS = [
  { href: "/ajustes/perfil", label: "👤 Mi perfil" },
  { href: "/ajustes/hogar", label: "🏠 Configuración del hogar" },
  { href: "/ajustes/miembros", label: "👥 Miembros del hogar" },
  { href: "/ajustes/cuenta", label: "💳 Cuenta" },
  { href: "/ajustes/soporte", label: "💬 Soporte" },
]

export function UserMenu({
  name,
  color,
  image,
}: {
  name: string
  color: string
  image?: string | null
}) {
  const router = useRouter()
  const initial = name.trim().charAt(0).toUpperCase() || "?"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Menú de usuario"
        data-tour="user-menu"
      >
        <Avatar>
          {image && <AvatarImage src={image} />}
          <AvatarFallback
            style={{ backgroundColor: memberColorVar(color), color: "white" }}
          >
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {MENU_LINKS.map((item) => (
          <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            authClient.signOut().then(() => {
              router.push("/login")
              router.refresh()
            })
          }}
        >
          🚪 Salir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
