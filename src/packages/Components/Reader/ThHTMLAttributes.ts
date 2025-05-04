export interface ThHTMLAttributes<T> extends React.HTMLAttributes<T> {
  ref?: React.ForwardedRef<T>;
}