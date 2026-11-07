/** Start effect work after commit and cancel work/cleanup on dependency changes. */
export function scheduleEffect(effect: () => void | (() => void)): () => void {
  let cleanup: void | (() => void)
  let disposed = false
  const timer = globalThis.setTimeout(() => { cleanup = effect() }, 0)
  return () => {
    if (disposed) return
    disposed = true
    globalThis.clearTimeout(timer)
    cleanup?.()
  }
}
