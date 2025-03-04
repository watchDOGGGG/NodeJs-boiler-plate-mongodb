export const generateRandomPassword = (length = 8) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-='

  const all = letters + letters.toUpperCase() + numbers + symbols

  let password = ''
  for (let i = 0; i < length; i++) {
    password += all.charAt(Math.floor(Math.random() * all.length))
  }
  return password
}
