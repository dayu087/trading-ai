import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react'
import { useScroll, motion } from 'framer-motion'
import { styled } from 'styled-components'
import { useLocation } from 'react-router-dom'

interface ScrollContextType {
  scrollRef: React.RefObject<HTMLDivElement>
  getScrollElement: () => HTMLDivElement | null
}

const ScrollContext = createContext<ScrollContextType | null>(null)

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()

  const { scrollYProgress } = useScroll({
    container: scrollRef,
  })

  const getScrollElement = () => scrollRef.current

  const inertiaY = useRef(0)
  const velocityY = useRef(0)
  const isTicking = useRef(false)

  const damping = 0.08
  const friction = 0.92

  const tickRef = useRef<() => void>(() => {})

  // useEffect(() => {
  //   tickRef.current = () => {
  //     const el = scrollRef.current
  //     if (!el) return

  //     velocityY.current *= friction
  //     inertiaY.current += velocityY.current

  //     el.scrollTop = inertiaY.current

  //     if (Math.abs(velocityY.current) > 0.2) {
  //       requestAnimationFrame(tickRef.current)
  //     } else {
  //       isTicking.current = false
  //     }
  //   }
  // }, [])

  // const onWheel = useCallback((e: WheelEvent) => {
  //   const el = scrollRef.current
  //   if (!el) return

  //   if (!isTicking.current) {
  //     inertiaY.current = el.scrollTop
  //     isTicking.current = true
  //     requestAnimationFrame(tickRef.current)
  //   }

  //   velocityY.current += e.deltaY * damping
  // }, [])

  // useEffect(() => {
  //   const el = scrollRef.current
  //   if (!el) return

  //   el.addEventListener('wheel', onWheel, { passive: true })
  //   return () => el.removeEventListener('wheel', onWheel)
  // }, [onWheel])

  // useEffect(() => {
  //   const el = scrollRef.current
  //   if (!el) return

  //   inertiaY.current = el.scrollTop
  //   velocityY.current = -(inertiaY.current * 0.25)
  //   isTicking.current = true
  //   requestAnimationFrame(tickRef.current)
  // }, [location.pathname])

  /* ----------------------------------------------------- */

  return (
    <ScrollContext.Provider value={{ scrollRef, getScrollElement }}>
      <Wrapper>
        {/* <ProgressBar style={{ scaleX: scrollYProgress }} /> */}
        <ScrollContainer ref={scrollRef} $path={location.pathname}>
          {children}
        </ScrollContainer>
      </Wrapper>
    </ScrollContext.Provider>
  )
}

export function useScrollContext() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScrollContext must be used within ScrollProvider')
  return ctx
}

/* -------------------------------------------------- */

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background: var(--brand-green);
  transform-origin: 0% 0%;
  z-index: 99999;
`

const ScrollContainer = styled.div<{ $path: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 40px;
  overflow-y: scroll;
  height: calc(100dvh - 64px);
  height: ${({ $path }) => ($path === '/reset-password' ? 'calc(100dvh)' : 'calc(100dvh - 64px)')};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    /* background: rgba(136, 84, 255, 0.65); */
    background: #f3f3f3;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding-top: 20px;
  }
`
