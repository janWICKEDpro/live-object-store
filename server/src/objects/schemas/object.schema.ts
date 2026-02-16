import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ObjectDocument = HydratedDocument<StoreObject>;

@Schema({
    timestamps: true,
    collection: 'objects',
    toJSON: {
        transform: (doc, ret) => {
            const obj = ret as any;
            obj.id = obj._id;
            delete obj._id;
            delete obj.__v;
            delete obj.updatedAt;
            return obj;
        }
    }
})
export class StoreObject {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    imageUrl: string;
}

export const ObjectSchema = SchemaFactory.createForClass(StoreObject);
