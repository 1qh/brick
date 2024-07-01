import React from 'react'

interface Stop {
  color: string
  offset?: number
  opacity?: number
}

interface GradientIconProps {
  className?: string
  stops: Stop[]
  rotateGradient?: number
}

interface GradientIconParentProps extends GradientIconProps {
  sourceSvgWidth?: number
  sourceSvgHeight?: number
  children: React.ReactNode
}

export default function GradientIcon({
  children,
  className,
  stops,
  rotateGradient,
  sourceSvgWidth = 24,
  sourceSvgHeight = 24
}: GradientIconParentProps): JSX.Element {
  const gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={`0 0 ${sourceSvgWidth} ${sourceSvgHeight}`}
      className={className}
      fill={`url(#${gradientId})`}>
      <defs>
        <linearGradient
          id={gradientId}
          x1='0%'
          y1='0%'
          x2='100%'
          y2='0%'
          gradientTransform={`rotate(${
            typeof rotateGradient !== 'undefined' ? rotateGradient : 25
          })`}>
          {stops.map((stop, i) => (
            <stop
              key={i}
              offset={
                stop.offset
                  ? `${stop.offset}%`
                  : i === 0
                    ? '0%'
                    : i === stops.length
                      ? '100%'
                      : `${i * (100 / (stops.length - 1))}%`
              }
              style={{
                stopColor: stop.color,
                stopOpacity: stop.opacity ? stop.opacity : 1
              }}
            />
          ))}
        </linearGradient>
      </defs>
      {children}
    </svg>
  )
}
