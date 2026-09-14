import { useEffect } from 'react'
import type { RefObject } from 'react'

/** Calls `onOutside` when a pointerdown happens outside every given ref. */
export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  onOutside: () => void,
  active = true
) {
  useEffect(() => {
    if (!active) return

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node
      const isInside = refs.some((ref) => ref.current?.contains(target))
      if (!isInside) onOutside()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [refs, onOutside, active])
}
