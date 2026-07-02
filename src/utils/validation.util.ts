export function isValidEmail (value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export function isValidCnpj (value: string): boolean {
  const cnpj = value.replace(/\D/g, '')

  if (cnpj.length !== 14) return false
  if (/^(\d)\1+$/.test(cnpj)) return false

  const calcDigit = (base: string, weights: number[]): number => {
    const sum = base
      .split('')
      .reduce((acc, digit, index) => acc + Number(digit) * weights[index]!, 0)

    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  const firstDigit = calcDigit(cnpj.slice(0, 12), firstWeights)
  const secondDigit = calcDigit(cnpj.slice(0, 12) + firstDigit, secondWeights)

  return cnpj.endsWith(`${firstDigit}${secondDigit}`)
}

export function isValidNcm (value: string): boolean {
  const ncm = value.replace(/\D/g, '')
  return ncm.length === 8
}

export function isRequired (value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export function minLength (value: string, min: number): boolean {
  return value.trim().length >= min
}

export function maxLength (value: string, max: number): boolean {
  return value.trim().length <= max
}
