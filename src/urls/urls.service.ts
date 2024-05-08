import { ShortenUrlDto } from './dto/shorten-url.dto'
import { PrismaService } from './../common/prisma.service'
import { Injectable } from '@nestjs/common'
import { createRandomString } from './helpers/create-random-string.helper'

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) { }

  async shortenUrl(shortenUrlDto: ShortenUrlDto, userId: number = null) {
    const { longUrl, customCode } = shortenUrlDto

    const shortCode: string = customCode ?
      customCode :
      createRandomString(6)

    const shortUrl = await this.prisma.urls.create({
      data: {
        longUrl,
        shortCode,
        createdBy: userId ? { connect: { id: userId } } : undefined
      }
    })

    return {
      shortCode: shortUrl.shortCode,
      originalUrl: shortUrl.longUrl
    }
  }

  async deleteUrl(id: number) {
    // TODO
    await Promise.resolve()

    return id
  }
}
