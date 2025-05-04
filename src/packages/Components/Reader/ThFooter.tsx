import React from "react"

export const ThFooter = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <aside { ...props }>
      { props.children }
    </aside>
  )
}