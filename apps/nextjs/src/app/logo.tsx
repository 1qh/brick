import Image from 'next/image'

import type { Source } from '~/types'

interface LogoProps {
  source: Source
  size: number
  className?: string
}

const Logo = ({ source, size, className }: LogoProps) => (
  <Image
    className={className}
    src={'/' + source + (source === 'linkedin' ? '.svg' : '.ico')}
    alt={source}
    width={size}
    height={size}
  />
)

export default Logo
