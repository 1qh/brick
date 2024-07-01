import * as React from 'react'
import { useEffect, useImperativeHandle, useRef } from 'react'

import { cn } from '@a/ui'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    useImperativeHandle(ref, () => textAreaRef.current ?? new HTMLTextAreaElement())
    useEffect(() => {
      const ref = textAreaRef.current
      const updateTextareaHeight = () => {
        if (ref) {
          ref.style.height = 'auto'
          ref.style.height = ref.scrollHeight + 'px'
        }
      }
      updateTextareaHeight()
      ref?.addEventListener('input', updateTextareaHeight)
      return () => ref?.removeEventListener('input', updateTextareaHeight)
    }, [])

    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={textAreaRef}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
