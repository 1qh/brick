import type { SIDE_OPTIONS } from '@radix-ui/react-popper'

import { Tooltip, TooltipContent, TooltipTrigger } from '@a/ui/tooltip'

interface TutipProps {
  children: React.ReactNode
  side: (typeof SIDE_OPTIONS)[number]
  content?: string
}

const Tutip = ({ content, side, children }: TutipProps) =>
  content ? (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className='capitalize' side={side}>
        {content}
      </TooltipContent>
    </Tooltip>
  ) : (
    children
  )

export default Tutip
