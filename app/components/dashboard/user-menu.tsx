'use client'

import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import Link from 'next/link'

export default function UserMenu() {
  const { user, loading, signOut } = useAuth()

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
          variant="ghost"
          size="icon"
          className="rounded-full p-0 w-8 h-8 flex items-center justify-center"
          aria-label="User menu"
        >
          <User size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-2">
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-muted text-sm text-left"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </PopoverContent>
    </Popover>
  )
}