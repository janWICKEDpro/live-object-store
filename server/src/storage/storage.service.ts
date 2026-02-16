import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
    private supabase: SupabaseClient;
    private bucket: string;

    constructor(private configService: ConfigService) {
        this.supabase = createClient(
            this.configService.getOrThrow<string>('SUPABASE_URL'),
            this.configService.getOrThrow<string>('SUPABASE_KEY'),
        );
        this.bucket = this.configService.get<string>('SUPABASE_BUCKET') || 'objects';
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const fileName = `${Date.now()}-${file.originalname}`;
        const { data, error } = await this.supabase.storage
            .from(this.bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) {
            throw new InternalServerErrorException(`Upload failed: ${error.message}`);
        }

        const { data: publicUrlData } = this.supabase.storage
            .from(this.bucket)
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    }

    async deleteFile(imageUrl: string): Promise<void> {
        const fileName = imageUrl.split('/').pop();
        if (!fileName) return;

        const { error } = await this.supabase.storage
            .from(this.bucket)
            .remove([fileName]);

        if (error) {
            console.error(`Failed to delete file ${fileName} from Supabase:`, error);
            // We might not want to throw here to allow DB deletion to proceed, or maybe we do.
            // For now, just log.
        }
    }
}
