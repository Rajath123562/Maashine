'use client'
import { toggleServiceStatus } from '../app/actions/services'
import { useTransition } from 'react'

export default function ServiceToggle({ id, active }: { id: string, active: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button 
      onClick={() => startTransition(() => toggleServiceStatus(id, active))}
      disabled={isPending}
      className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
        active 
          ? 'bg-teal/10 text-teal hover:bg-teal/20' 
          : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
      } disabled:opacity-50`}
    >
      {isPending ? 'Updating...' : active ? 'Active' : 'Inactive'}
    </button>
  )
}
