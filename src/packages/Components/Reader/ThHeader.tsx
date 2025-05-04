import { ThHTMLAttributes } from "./ThHTMLAttributes";

export const ThHeader = ({ 
  ref,
  ...props 
}: ThHTMLAttributes<HTMLDivElement>) => {
  return (
    <header 
      ref={ ref } 
      { ...props }
    >
      { props.children }
    </header>
  )
}