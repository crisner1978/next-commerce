export default function formatDate(date: string | Date | number | any):string {
  return new Date(date).toLocaleDateString('en-US')
}