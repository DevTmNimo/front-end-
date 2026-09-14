import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { MessagesSquare, Package, Settings, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  icon: typeof MessagesSquare
  to?: string
  comingSoon?: boolean
}

const navItems: NavItem[] = [
  { label: 'Conversations', icon: MessagesSquare, to: '/conversations' },
  { label: 'Products', icon: Package, to: '/products' },
  { label: 'Settings', icon: Settings, comingSoon: true },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-svh bg-background text-foreground">
      <nav className="w-56 shrink-0 border-r border-border flex flex-col">
        <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
          <span className="size-2.5 rounded-sm bg-primary" />
          <span className="font-brand text-[15px] font-medium tracking-tight">
            Shoply
          </span>
        </div>

        <ul className="flex-1 px-2 py-3 flex flex-col gap-0.5">
          {navItems.map((item) =>
            item.comingSoon ? (
              <li key={item.label}>
                <span className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground opacity-50">
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                  <span className="ml-auto text-[10px]">Soon</span>
                </span>
              </li>
            ) : (
              <li key={item.label}>
                <NavLink
                  to={item.to!}
                  className={({ isActive }) =>
                    cn(
                      'w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )
                  }
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            )
          )}
        </ul>

        <div className="border-t border-border p-2 flex flex-col gap-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground truncate">
              {user?.shop_name ?? user?.email}
            </span>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void logout()}
            className="justify-start gap-2 text-muted-foreground"
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </nav>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
