export default function stringIsNullOrEmpty(value:string): boolean {
  return !value || value.trim().length === 0;
}
