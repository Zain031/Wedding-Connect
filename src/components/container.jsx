export default function Container({ children, className }) {
  return <div className={`container mx-auto my-4 p-4 ${className}`}>{children}</div>
}
