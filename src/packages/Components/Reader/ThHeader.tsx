import React from "react"

export const ThHeader = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <header { ...props }>
      { props.children }
    </header>
  )
}