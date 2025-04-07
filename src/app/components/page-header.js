'use client'

export function PageHeader({ title, description, className = '' }) {
  return (
    <div className={`bg-background ${className}`}>
      <div className="container px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-red-900">{title}</h1>
        {description && (
          <p className="text-xl text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
} 