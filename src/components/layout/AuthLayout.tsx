import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex items-center gap-2 justify-center">
          <span className="size-2.5 rounded-sm bg-primary" />
          <span className="font-brand text-[17px] font-medium tracking-tight">
            Shoply
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
