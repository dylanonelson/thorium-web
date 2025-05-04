import { ThHTMLAttributes } from "./ThHTMLAttributes";

export const ThFooter = ({ 
  ref,
  ...props 
}: ThHTMLAttributes<HTMLDivElement>) => {
  return (
    <aside 
      ref={ ref } 
      { ...props }
    >
      { props.children }
    </aside>
  )
}