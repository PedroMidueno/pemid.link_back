import { ShortenUrlDto } from './dto/shorten-url.dto'
import { PrismaService } from './../common/prisma.service'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { createRandomString, parseValidUrl } from './helpers'
import { GetUrlsDto } from './dto/get-urls.dto'
import { parseQueryParameters } from 'src/common/helpers'
import { PaginationDto } from 'src/common/dto/pagination.dto'

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) { }

  async getUrlsByUserId(getUrlsDto: GetUrlsDto, userId: number) {
    const { findBy, skip, take } = parseQueryParameters(getUrlsDto as PaginationDto, ['longUrl', 'shortCode'])
    const urls = await this.prisma.urls.findMany({
      where: {
        createdById: userId,
        OR: findBy
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const count = await this.prisma.urls.count({
      where: {
        createdById: userId,
        OR: findBy
      }
    })


    return {
      count,
      urls
    }
  }

  async getOriginalUrl(shortCode: string) {
    const longUrl = await this.prisma.urls.findUnique({
      where: {
        shortCode,
        enabled: true
      },
      select: {
        longUrl: true
      }
    })

    if (!longUrl)
      throw new NotFoundException('There is not any url related to this code')

    return longUrl
  }

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
          longUrl: parseValidUrl(longUrl),
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
        longUrl: parseValidUrl(longUrl),
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
        longUrl: parseValidUrl(longUrl),
        shortCode: customCode.replaceAll(' ', '-'),
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

  async changeEnableState (id: number) {
    const urlInDB = await this.prisma.urls.findUnique({
      where: { id }
    })

    if (urlInDB) {
      return await this.prisma.urls.update({
        where: { id },
        data: { enabled: !urlInDB.enabled }
      })
    } else {
      throw new NotFoundException('url with provided id does not exists', {
        cause: 'No se encontró la url'
      })
    }
  }

  async deleteUrl(id: number) {
    const urlInDB = await this.prisma.urls.findUnique({
      where: { id }
    })

    if (urlInDB) {
      await this.prisma.urls.delete({
        where: { id }
      })
    } else {
      throw new NotFoundException('url with provided id does not exists', {
        cause: 'No se encontró la url'
      })
    }
  }

  async shortCodeExistsInDB(shortCode: string) {
    const shortCodeInDb = await this.prisma.urls.findFirst({
      where: {
        shortCode
      }
    })

    return {
      exists: !!shortCodeInDb
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
