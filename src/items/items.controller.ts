import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() dto: CreateItemDto, @CurrentUser() user: User) {
    return this.itemsService.upsert(dto, user.id);
  }

  @Get()
  findAll(@Query('q') q?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.itemsService.findAll(q, limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
  }

  @Get('sku/:sku')
  findBySku(@Param('sku') sku: string) {
    return this.itemsService.findBySku(sku);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.itemsService.remove(id);
  }

  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname) || '.jpg'}`),
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  addPhotos(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.itemsService.addPhotos(id, files);
  }
}
