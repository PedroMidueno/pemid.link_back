import { BadRequestException } from '@nestjs/common'

export const createRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

export const parseValidUrl = (url: string) => {
  const hasHTTP = url.indexOf('http') === 0

  let validUrl: string = url

  if (!hasHTTP) validUrl = 'http://' + url

  const urlObject = new URL(validUrl)

  if (urlObject.hostname.includes('pemid.link')) {
    throw new BadRequestException('invalid url', {
      cause: 'No se puede acortar urls de pemid.link'
    })
  }

  return validUrl
}
