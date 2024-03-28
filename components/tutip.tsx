import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export const Tutip = ({ content, children }: { content: string; children: React.ReactNode }) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className='notranslate' side='right'>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
