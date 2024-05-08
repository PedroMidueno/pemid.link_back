import { Body, Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { UrlsService } from './urls.service'
import { ShortenUrlDto } from './dto/shorten-url.dto'
import { GetUser } from 'src/common/decorators/get-user.decorator'

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten-public')
  shortenUrlPublic(@Body() shortenUrlDto: ShortenUrlDto) {
    return this.urlsService.shortenUrl(shortenUrlDto)
  }

  @Post('shorten')
  @UseGuards(AuthGuard())
  shortenUrl(@Body() shortenUrlDto: ShortenUrlDto, @GetUser('id') userId: number) {
    return this.urlsService.shortenUrl(shortenUrlDto, userId)
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard())
  deleteShortUrl(@Param('id', ParseIntPipe) id: number) {
    return this.urlsService.deleteUrl(id)
  }
}
