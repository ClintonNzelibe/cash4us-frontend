import { test, expect } from '@playwright/test'
import { scheduleEffect } from '../../src/utils/scheduleEffect'

const tick = () => new Promise(resolve => setTimeout(resolve, 20))

test('cancelled startup does not fetch or reset state after unmount', async () => {
  let calls = 0
  const cancel = scheduleEffect(() => { calls++ })
  cancel()
  await tick()
  expect(calls).toBe(0)
})

test('started work retains and runs its cancellation cleanup once', async () => {
  let started = 0; let cleaned = 0
  const cancel = scheduleEffect(() => { started++; return () => { cleaned++ } })
  expect(started).toBe(0)
  await tick()
  expect(started).toBe(1)
  cancel(); cancel()
  expect(cleaned).toBe(1)
})

test('effect replacement cancels stale startup and starts current work only', async () => {
  const calls: string[] = []
  const previous = scheduleEffect(() => { calls.push('previous') })
  previous()
  const current = scheduleEffect(() => { calls.push('current') })
  await tick(); current()
  expect(calls).toEqual(['current'])
})
