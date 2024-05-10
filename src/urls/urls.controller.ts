import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { UrlsService } from './urls.service'
import { ShortenUrlDto } from './dto/shorten-url.dto'
import { GetUser } from 'src/common/decorators/get-user.decorator'

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten-public')
  shortenUrlPublic(@Body() shortenUrlDto: ShortenUrlDto) {
    return this.urlsService.publicShortenUrl(shortenUrlDto)
  }

  @Post('shorten')
  @UseGuards(AuthGuard())
  shortenUrl(@Body() shortenUrlDto: ShortenUrlDto, @GetUser('id') userId: number) {
    return this.urlsService.shortenUrl(shortenUrlDto, userId)
  }

  @Post('shorten-custom')
  @UseGuards(AuthGuard())
  shortenUrlCustom(@Body() shortenUrlDto: ShortenUrlDto, @GetUser('id') userId: number) {
    return this.urlsService.customShortenUrl(shortenUrlDto, userId)
  }

  @Get('custom-code-exists/:code')
  @UseGuards(AuthGuard())
  searchCustomCode(@Param('code') customCode: string) {
    return this.urlsService.shortCodeExistsInDB(customCode)
  }

  @Put('disable/:id')
  @UseGuards(AuthGuard())
  disableUrl(@Param('id', ParseIntPipe) urlId: number) {
    return this.urlsService.deleteOrDisableUrl(urlId)
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard())
  deleteShortUrl(@Param('id', ParseIntPipe) id: number) {
    return this.urlsService.deleteOrDisableUrl(id, false)
  }
}
