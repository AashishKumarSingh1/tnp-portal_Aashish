import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        href="/super-admin/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          {index === items.length - 1 ? (
            <span className="ml-1 text-foreground font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="ml-1 hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
} 