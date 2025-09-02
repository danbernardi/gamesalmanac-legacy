'use client'

import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UserMenu() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
    )
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm" className="bg-card/75 border-border/75">
          Sign In
        </Button>
      </Link>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          className="flex items-center justify-center"
          aria-label="User menu"
          animate={false}
        >
          <User size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="bg-white text-neutral-800 w-auto p-3">
        <p className="text-muted-foreground mb-2">{user.email}</p>
        <Button
          onClick={handleSignOut}
          animate={false}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </PopoverContent>
    </Popover>
  )
}