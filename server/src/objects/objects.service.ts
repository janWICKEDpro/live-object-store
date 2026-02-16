import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreObject, ObjectDocument } from './schemas/object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { StorageService } from '../storage/storage.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ObjectsService {
    constructor(
        @InjectModel(StoreObject.name) private objectModel: Model<ObjectDocument>,
        private storageService: StorageService,
        private eventsGateway: EventsGateway,
    ) { }

    async create(createObjectDto: CreateObjectDto, file: Express.Multer.File): Promise<StoreObject> {
        const imageUrl = await this.storageService.uploadFile(file);
        const createdObject = new this.objectModel({
            ...createObjectDto,
            imageUrl,
            size: file.size,
        });
        const savedObject = await createdObject.save();
        this.eventsGateway.emitNewObject(savedObject);
        return savedObject;
    }

    async findAll(query?: string): Promise<StoreObject[]> {
        if (query) {
            return this.objectModel.find({
                title: { $regex: query, $options: 'i' },
            }).exec();
        }
        return this.objectModel.find().sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<StoreObject> {
        const object = await this.objectModel.findById(id).exec();
        if (!object) {
            throw new NotFoundException(`Object with ID ${id} not found`);
        }
        return object;
    }

    async remove(id: string): Promise<void> {
        const object = await this.findOne(id);
        await this.storageService.deleteFile(object.imageUrl);
        await this.objectModel.findByIdAndDelete(id).exec();
        this.eventsGateway.emitDeleteObject(id);
    }
}
