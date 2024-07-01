import { cn } from '@a/ui'
import { Button } from '@a/ui/button'

interface FillInputProps {
  list: string[]
  inputId: string
  className?: string
}

const FillInput = ({ list, inputId, className }: FillInputProps) =>
  list.length
    ? list.map((k, i) => (
        <Button
          onClick={() => {
            try {
              const inputArea = document.getElementById(inputId) as HTMLInputElement
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value'
              )?.set?.bind(inputArea)
              nativeInputValueSetter?.(k)
              const ev = new Event('input', { bubbles: true })
              inputArea.dispatchEvent(ev)
            } catch {
              const inputArea = document.getElementById(inputId) as HTMLTextAreaElement
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                'value'
              )?.set?.bind(inputArea)
              nativeInputValueSetter?.(k)
              const ev = new Event('input', { bubbles: true })
              inputArea.dispatchEvent(ev)
            }
          }}
          key={i}
          variant='ghost'
          className={cn('notranslate w-full justify-start font-normal', className)}>
          {k}
        </Button>
      ))
    : null

export default FillInput
