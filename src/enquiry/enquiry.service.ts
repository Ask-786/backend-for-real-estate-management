import { Property } from './../property/model/property.model';
import { EnquiryRequestData } from './model/enquiryRequest.interface';
import { PropertyService } from './../property/property.service';
import { EnquiryRepository } from './repository/enquiry.repository';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class EnquiryService {
  constructor(
    private enquiryRepostory: EnquiryRepository,
    private propertyService: PropertyService,
  ) {}

  async getUserEnquiries(userId: string) {
    const enquiries = await this.enquiryRepostory.findAndPopulate(
      {
        propertyOwner: new mongoose.Types.ObjectId(userId),
      },
      { path: 'property', model: Property.name },
    );
    return { enquiries };
  }

  async getOneEnquiry(id: string) {
    const enquiry = await this.enquiryRepostory.findOneAndPopulate(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { path: 'property', model: Property.name },
    );
    return { enquiry };
  }

  async createEnquiry(
    enquiryData: EnquiryRequestData,
    user: string,
    email: string,
  ) {
    try {
      const property = await this.propertyService.getProperty(
        enquiryData.property,
      );
      if (property !== null) {
        return await this.enquiryRepostory.create({
          title: enquiryData.title,
          sender: new mongoose.Types.ObjectId(user),
          propertyOwner: new mongoose.Types.ObjectId(property.owner),
          senderEmail: email,
          content: enquiryData.content,
          property: property._id,
          topic: enquiryData.topic,
        });
      } else {
        throw new NotFoundException('Property not found ');
      }
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
