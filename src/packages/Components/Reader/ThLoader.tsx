import { ReactNode } from "react";

export interface ThLoaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "aria-busy" | "aria-live"> {
  isLoading: boolean;
  loader: ReactNode;
  children: ReactNode;
}

// Since we are removing readerLoader entirely, no need for aria-hidden={ !isLoading }
// No need for a label either since we are using the string for the animation
export const ThLoader = ({ 
  isLoading,
  loader,
  children,
  ...props
 }: ThLoaderProps) => {
  return (
    <>
    <div 
      { ...props }
      aria-busy={ isLoading } 
      aria-live="polite"
    >
      { isLoading && loader }
      { children }
    </div>
    </>
  )
}