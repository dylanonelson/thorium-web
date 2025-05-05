import { ThHTMLAttributes } from "./ThHTMLAttributes";

export const ThFooter = ({ 
  ref,
  children,
  ...props 
}: ThHTMLAttributes<HTMLDivElement>) => {
  return (
    <aside 
      ref={ ref } 
      { ...props }
    >
      { children }
    </aside>
  )
}