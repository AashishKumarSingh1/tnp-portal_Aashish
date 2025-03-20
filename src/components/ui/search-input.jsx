import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-8"
      />
    </div>
  )
} 