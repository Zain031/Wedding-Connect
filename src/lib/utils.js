export function limitChars(str, limit = 20) {
  return str.length > limit ? str.slice(0, limit) + '...' : str
}

export function kebabCase(string) {
  return string
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}
