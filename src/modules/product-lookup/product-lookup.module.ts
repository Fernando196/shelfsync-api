import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductLookup } from './entities/product-lookup.entity';
import { ProductLookupService } from './product-lookup.service';
import { ProductLookupController } from './product-lookup.controller';
import { PRODUCT_LOOKUP_REPOSITORY } from './interfaces/product-lookup.repository';
import { ProductLookupRepository } from './product-lookup.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductLookup])],
  providers: [
    ProductLookupService,
    { provide: PRODUCT_LOOKUP_REPOSITORY, useClass: ProductLookupRepository },
  ],
  controllers: [ProductLookupController],
})
export class ProductLookupModule {}
