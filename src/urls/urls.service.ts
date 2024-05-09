import { ShortenUrlDto } from './dto/shorten-url.dto'
import { PrismaService } from './../common/prisma.service'
import { Injectable } from '@nestjs/common'
import { createRandomString } from './helpers/create-random-string.helper'

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) { }

  async publicShortenUrl(shortenUrlDto: ShortenUrlDto) {
    const { longUrl } = shortenUrlDto

    let shortUrl: { shortCode: string, longUrl?: string }

    // verify if url already exists in database
    const existingUrl = await this.searchUrlInDatabase(longUrl)

    if (!existingUrl) {
      // create random string
      const shortCode: string = await this.generateNonExistingRandomString()

      // create url record in db
      shortUrl = await this.prisma.urls.create({
        data: {
          longUrl,
          shortCode
        },
        select: {
          shortCode: true,
          longUrl: true
        }
      })
    } else {
      // if url already exists in db, returns its short code
      shortUrl = existingUrl
    }

    return {
      shortCode: shortUrl.shortCode,
      originalUrl: shortUrl.longUrl
    }
  }

  async shortenUrl(shortenUrlDto: ShortenUrlDto, userId: number) {
    // TODO
    await Promise.resolve()

    return {
      shortenUrlDto,
      userId
    }
  }

  async customShortenUrl(shortenUrlDto: ShortenUrlDto, userId: number) {
    // TODO
    await Promise.resolve()

    return {
      shortenUrlDto,
      userId
    }
  }

  async deleteUrl(id: number) {
    await this.prisma.urls.delete({
      where: { id }
    })
  }

  async searchCustomCode(customCode: string) {
    // TODO
    await Promise.resolve()

    return customCode
  }

  private async searchUrlInDatabase(longUrl: string) {
    return await this.prisma.urls.findFirst({
      where: { longUrl },
      select: {
        shortCode: true,
        longUrl: true
      }
    })
  }

  private async generateNonExistingRandomString(): Promise<string> {
    const randomString = createRandomString(6)

    const randomStringExistsInDb = await this.prisma.urls.findFirst({
      where: { shortCode: randomString }
    })

    if (!randomStringExistsInDb) return randomString
    else return await this.generateNonExistingRandomString()
  }
}
