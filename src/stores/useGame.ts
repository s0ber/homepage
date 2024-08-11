import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

type Store = {
    blocksCount: number
    phase: 'ready' | 'playing' | 'ended',
    blocksSeed: number,
    start: () => void,
    restart: () => void,
    end: () => void
    startTime: number
    endTime: number
}

export const useGame = create(subscribeWithSelector<Store>((set) => {
  return {
    blocksCount: 10,
    phase: 'ready' as 'ready' | 'playing' | 'ended',
    blocksSeed: 0,
    start: () => {
      set(({ phase }) =>
        phase === 'ready' ? { phase: 'playing', startTime: Date.now() } : {})
    },
    restart: () => {
      set(({ phase }) =>
        ['playing', 'ended'].includes(phase) ? { phase: 'ready', blocksSeed: Math.random() } : {})
    },
    end: () => {
      set(({ phase }) =>
        phase === 'playing' ? { phase: 'ended', endTime: Date.now() } : {})
    },
    startTime: 0,
    endTime: 0
  }
}))
