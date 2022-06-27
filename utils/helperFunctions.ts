export const truncate = (string: string, number: number) => {
  return string?.length > number ? string.substring(0, number - 1) + "..." : string
}