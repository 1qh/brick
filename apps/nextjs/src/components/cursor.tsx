'use client'

import type { MotionValue, SpringOptions } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

import { cn } from '@a/ui'

interface MouseMoveEvent {
  clientX: number
  clientY: number
}

export default function Cursor() {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const cursor = useRef<HTMLDivElement>(null)
  const cursorSize = isPressed ? 18 : 12
  const [isVisible, setIsVisible] = useState(false)

  const mouse: {
    x: MotionValue<number>
    y: MotionValue<number>
  } = {
    x: useMotionValue(0),
    y: useMotionValue(0)
  }

  const smoothOptions: SpringOptions = {
    damping: 20,
    stiffness: 300,
    mass: 0.5
  }
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions)
  }

  const manageResize = () => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) {
      setIsVisible(false)
      return
    }
  }

  const manageMouseMove = (e: MouseMoveEvent) => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) {
      setIsVisible(false)
      return
    }
    if (!isVisible) {
      setIsVisible(true)
    }

    const { clientX, clientY } = e
    mouse.x.set(clientX - cursorSize / 2)
    mouse.y.set(clientY - cursorSize / 2)
  }

  const manageMouseLeave = () => setIsVisible(false)
  const handleMouseUp = () => setIsPressed(false)
  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 2) {
      return
    }
    setIsPressed(true)
  }

  useEffect(() => {
    window.addEventListener('resize', manageResize)
    document.body.addEventListener('mouseleave', manageMouseLeave, { passive: true })
    window.addEventListener('mousemove', manageMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })
    return () => {
      window.removeEventListener('resize', manageResize)
      window.removeEventListener('mouseleave', manageMouseLeave)
      window.removeEventListener('mousemove', manageMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const template = ({
    rotate,
    scaleX,
    scaleY
  }: {
    rotate: number
    scaleX: number
    scaleY: number
  }) => `rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`

  return (
    motion.div && (
      <motion.div
        transformTemplate={template}
        style={{ left: smoothMouse.x, top: smoothMouse.y, scaleX: mouse.x, scaleY: mouse.y }}
        animate={{ width: cursorSize, height: cursorSize }}
        className={cn(
          'pointer-events-none fixed size-3.5 rounded-full shadow',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        ref={cursor}
      />
    )
  )
}
