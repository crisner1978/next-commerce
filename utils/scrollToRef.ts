export default function scrollToRef(ref: any) {
  return ref.current.scrollIntoView({ behavior: "smooth" })
}