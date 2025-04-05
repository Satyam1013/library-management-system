import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  DigitalResource,
  DigitalResourceDocument,
} from "./digital-resources.schema";

@Injectable()
export class DigitalResourcesService {
  constructor(
    @InjectModel(DigitalResource.name)
    private digitalResourceModel: Model<DigitalResourceDocument>,
  ) {}

  async findAll(): Promise<DigitalResource[]> {
    return this.digitalResourceModel.find();
  }

  async findOne(id: string): Promise<DigitalResource> {
    const resource = await this.digitalResourceModel.findById(id);
    if (!resource) throw new NotFoundException("Resource not found");
    return resource;
  }
}
