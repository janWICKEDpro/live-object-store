import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, Query, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import type { Express } from 'express';

@Controller('objects')
@UseInterceptors(TransformInterceptor)
export class ObjectsController {
    constructor(private readonly objectsService: ObjectsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() createObjectDto: CreateObjectDto, @UploadedFile() file: Express.Multer.File) {
        return this.objectsService.create(createObjectDto, file);
    }

    @Get()
    findAll(@Query('search') search?: string) {
        return this.objectsService.findAll(search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.objectsService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.objectsService.remove(id);
    }
}
