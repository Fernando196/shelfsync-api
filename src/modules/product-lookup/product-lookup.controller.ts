import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FiltersInput } from '../common/query-filters';
import { ProductLookupService } from './product-lookup.service';
import { CreateProductLookupDto } from './dto/create-product-lookup.dto';
import { UpdateProductLookupDto } from './dto/update-product-lookup.dto';

@Controller('product-lookup')
export class ProductLookupController {
  constructor(private readonly productLookupService: ProductLookupService) {}

  @Get('')
  findAll(
    @Query('filters') filters: FiltersInput,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productLookupService.findAll(filters, page, limit);
  }

  @Get('barcode/:barcode')
  async findByBarcode(@Param('barcode') barcode: string) {
    const productLookup = await this.productLookupService.findByBarcode(barcode);
    if (!productLookup) throw new NotFoundException('The product lookup does not exist');
    return productLookup;
  }

  @Get('sku/:sku')
  async findBySku(@Param('sku') sku: string) {
    const productLookup = await this.productLookupService.findBySku(sku);
    if (!productLookup) throw new NotFoundException('The product lookup does not exist');
    return productLookup;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productLookupService.findById(id);
  }

  @Post('')
  create(@Body() dto: CreateProductLookupDto, @CurrentUser() currentUser: User) {
    return this.productLookupService.create(dto, currentUser);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductLookupDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.productLookupService.update(id, dto, currentUser);
  }

  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() dto: UpdateProductLookupDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.productLookupService.update(id, dto, currentUser);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.productLookupService.remove(id);
  }
}
