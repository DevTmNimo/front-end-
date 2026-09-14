import { useState } from 'react'
import type { FormEvent } from 'react'
import { Instagram, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

function ShopProfileSection() {
  const { user } = useAuth()
  const [shopName, setShopName] = useState(user?.shop_name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // TODO: wire to PATCH /shop once the Express endpoint exists
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop profile</CardTitle>
        <CardDescription>
          This is how your shop appears internally.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="shopName">Shop name</Label>
            <Input
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="gap-3">
          <Button type="submit">Save changes</Button>
          {saved && (
            <span className="text-sm text-muted-foreground">Saved</span>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

function InstagramConnectionSection() {
  const [connected, setConnected] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instagram connection</CardTitle>
        <CardDescription>
          Connect your Instagram/Facebook account so the bot can receive and
          reply to DMs.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
          <Instagram className="size-5" />
        </div>
        <div className="flex-1">
          {connected ? (
            <>
              <p className="text-sm font-medium">@your_shop</p>
              <Badge variant="success" className="mt-1">
                <CheckCircle2 className="size-3" />
                Connected
              </Badge>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Not connected</p>
          )}
        </div>
        <Button
          type="button"
          variant={connected ? 'outline' : 'default'}
          onClick={() => setConnected((c) => !c)}
        >
          {connected ? 'Disconnect' : 'Connect account'}
        </Button>
      </CardContent>
    </Card>
  )
}

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    // TODO: wire to POST /auth/change-password once the Express endpoint exists
    setSaved(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmNewPassword">Confirm new password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="gap-3">
          <Button type="submit">Update password</Button>
          {saved && (
            <span className="text-sm text-muted-foreground">Updated</span>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

export default function Settings() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="h-14 shrink-0 flex items-center px-6 border-b border-border">
        <h1 className="text-sm font-semibold">Settings</h1>
      </div>
      <div className="p-6 flex flex-col gap-6 max-w-xl">
        <ShopProfileSection />
        <InstagramConnectionSection />
        <ChangePasswordSection />
      </div>
    </div>
  )
}
