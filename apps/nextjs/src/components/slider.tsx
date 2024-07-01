import { forwardRef, Fragment, useEffect, useState } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@a/ui'

export interface SliderProps {
  className?: string
  min: number
  max: number
  minStepsBetweenThumbs: number
  step: number
  value?: [number, number]
  onValueChange?: (values: [number, number]) => void
}

const Slider = forwardRef(
  ({ className, min, max, step, value, onValueChange, ...props }: SliderProps, ref) => {
    const initialValue = Array.isArray(value) ? value : [min, max]
    const [localValues, setLocalValues] = useState(initialValue)

    useEffect(() => setLocalValues(Array.isArray(value) ? value : [min, max]), [min, max, value])

    const handleValueChange = (newValues: [number, number]) => {
      setLocalValues(newValues)
      if (onValueChange) {
        onValueChange(newValues)
      }
    }
    return (
      <SliderPrimitive.Root
        ref={ref as React.RefObject<HTMLDivElement>}
        min={min}
        max={max}
        step={step}
        value={localValues}
        onValueChange={handleValueChange}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        {...props}>
        <SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
          <SliderPrimitive.Range className='absolute h-full bg-primary' />
        </SliderPrimitive.Track>
        {localValues.map((value, index) => (
          <Fragment key={index}>
            <SliderPrimitive.Thumb className='block size-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'></SliderPrimitive.Thumb>
          </Fragment>
        ))}
      </SliderPrimitive.Root>
    )
  }
)

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
