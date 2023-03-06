import { AwsService } from './aws/aws.service';
import { PropertyService } from './property.service';
import {
  Body,
  Controller,
  Request,
  Get,
  Param,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  coOrdinates as cordType,
  propertyAddressType,
  PropertyDocument,
  propertyType as propType,
} from './model/property.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('property')
export class PropertyController {
  constructor(
    private propertyService: PropertyService,
    private aswService: AwsService,
  ) {}
  @Get()
  getProperties(@Query('page') page: number): Promise<PropertyDocument[]> {
    return this.propertyService.getProperties(page);
  }

  @Get('property/:id')
  getProperty(@Param('id') id: string): Promise<PropertyDocument> {
    return this.propertyService.getProperty(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-s3-upload-url')
  getS3UploadUrl() {
    return this.aswService.getS3UploadUrl();
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-property')
  createProperty(
    @Body('title') title: string,
    @Body('price') price: number,
    @Body('description') description: string,
    @Body('tags') tags: string,
    @Body('coOrdinates') coOrdinates: cordType,
    @Body('images') images: string[],
    @Body('propertyType') propertyType: propType,
    @Body('address')
    address: propertyAddressType,
    @Request() req,
  ) {
    const splittedTags = tags.trim().split(',');
    return this.propertyService.createProperty({
      title,
      price,
      description,
      tags: splittedTags,
      coOrdinates,
      images,
      propertyType,
      address,
      owner: req.user._id,
    });
  }
}
