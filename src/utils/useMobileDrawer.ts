import { useEffect, useRef } from 'react'

/** Keep off-canvas navigation out of keyboard focus and contain mobile focus. */
export function useMobileDrawer(open: boolean, onClose?: () => void) {
  const drawer = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = drawer.current
    if (!element) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const sync = () => {
      element.inert = !desktop.matches && !open
      document.body.style.overflow = open && !desktop.matches ? 'hidden' : previousOverflow
    }
    sync()
    desktop.addEventListener('change', sync)
    const focusable = () => [...element.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')]
      .filter(item => item.getClientRects().length > 0 && getComputedStyle(item).visibility !== 'hidden')
    if (open && !desktop.matches) focusable()[0]?.focus()
    const keyboard = (event: KeyboardEvent) => {
      if (!open || desktop.matches) return
      if (event.key === 'Escape') { event.preventDefault(); onClose?.() }
      if (event.key !== 'Tab') return
      const items = focusable(), first = items[0], last = items.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', keyboard)
    return () => {
      desktop.removeEventListener('change', sync)
      document.removeEventListener('keydown', keyboard)
      document.body.style.overflow = previousOverflow
      if (open && !desktop.matches) previousFocus?.focus()
    }
  }, [open, onClose])
  return drawer
}
