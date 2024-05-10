import { ShortenUrlDto } from './dto/shorten-url.dto'
import { PrismaService } from './../common/prisma.service'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { createRandomString } from './helpers/create-random-string.helper'

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) { }

  async publicShortenUrl(shortenUrlDto: ShortenUrlDto) {
    const { longUrl } = shortenUrlDto

    let shortUrl: { shortCode: string, longUrl: string }

    // verify if url already exists in database
    const existingUrl = await this.searchPublicUrlInDatabase(longUrl)

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
    const { longUrl } = shortenUrlDto

    const shortCode = await this.generateNonExistingRandomString()

    const shortUrl = await this.prisma.urls.create({
      data: {
        longUrl,
        shortCode,
        createdBy: { connect: { id: userId } }
      },
      select: {
        longUrl: true,
        shortCode: true
      }
    })

    return {
      shortCode: shortUrl.shortCode,
      originalUrl: shortUrl.longUrl
    }
  }

  async customShortenUrl(shortenUrlDto: ShortenUrlDto, userId: number) {
    const { customCode, longUrl } = shortenUrlDto

    if (!customCode)
      throw new BadRequestException('custom code was not provided')

    const { exists: alreadyUsed } = await this.shortCodeExistsInDB(customCode)

    if (alreadyUsed)
      throw new BadRequestException('custom code is already in use')

    const shortUrl = await this.prisma.urls.create({
      data: {
        longUrl,
        shortCode: customCode,
        createdBy: { connect: { id: userId } }
      },
      select: {
        shortCode: true,
        longUrl: true
      }
    })

    return {
      shortCode: shortUrl.shortCode,
      originalUrl: shortUrl.longUrl
    }
  }

  async deleteOrDisableUrl(id: number, disableOnly: boolean = true) {
    const urlInDB = await this.prisma.urls.findFirst({
      where: { id }
    })

    if (urlInDB) {

      if (disableOnly) {
        await this.prisma.urls.update({
          where: { id },
          data: { deleted: true }
        })
      } else {
        await this.prisma.urls.delete({
          where: { id }
        })
      }

    } else {
      throw new NotFoundException('url with provided id does not exists')
    }
  }

  async shortCodeExistsInDB(shortCode: string) {
    const shortCodeInDb = await this.prisma.urls.findFirst({
      where: {
        shortCode
      }
    })

    return {
      exists: shortCodeInDb ? true : false
    }
  }

  private async searchPublicUrlInDatabase(longUrl: string) {
    return await this.prisma.urls.findFirst({
      where: { longUrl, createdById: null },
      select: {
        shortCode: true,
        longUrl: true
      }
    })
  }

  private async generateNonExistingRandomString(): Promise<string> {
    const randomString = createRandomString(6)

    const { exists } = await this.shortCodeExistsInDB(randomString)

    if (!exists) return randomString
    else return await this.generateNonExistingRandomString()
  }
}
