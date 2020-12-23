export default function removeCPFChars (cpf: string) {
  return cpf.split('.').join('').split('-').join('')
}
