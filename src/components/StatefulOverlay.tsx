export interface StatefulOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean;
}

// This is meant to mount invisible zones that can be hovered, clicked, etc.
export const StatefulOverlay = ({ 
  isActive,
  ...props 
}: StatefulOverlayProps) => {
  return (
    <>
    { isActive 
      ? <div { ...props }></div>
      : null }
    </>
  );
}