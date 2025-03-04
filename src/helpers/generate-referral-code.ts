export const generateReferralCode = (organizationName: string): string => {
  const numbers = '0123456789'

  const nameParts = organizationName.split(' ')
  const initials = nameParts.length === 1 ? nameParts[0].slice(0, 2) : nameParts[0][0] + nameParts[1][0]

  let randomPart = ''

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length)
    randomPart += numbers[randomIndex]
  }

  return initials.toUpperCase() + randomPart
}
