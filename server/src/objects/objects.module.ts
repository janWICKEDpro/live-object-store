import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { StoreObject, ObjectSchema } from './schemas/object.schema';
import { StorageModule } from '../storage/storage.module';

// EventsModule is global, so no need to import it here if AppModule imports it.
// But explicit is fine too. Let's rely on global for cleaner deps, or import to be safe if not global.
// I made EventsModule global.

@Module({
    imports: [
        MongooseModule.forFeature([{ name: StoreObject.name, schema: ObjectSchema }]),
        StorageModule,
    ],
    controllers: [ObjectsController],
    providers: [ObjectsService],
})
export class ObjectsModule { }
