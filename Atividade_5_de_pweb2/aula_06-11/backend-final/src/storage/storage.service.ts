import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient | null = null;

  private getClient(): SupabaseClient {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      throw new InternalServerErrorException(
        'Supabase não configurado: defina SUPABASE_URL e SUPABASE_SERVICE_KEY no .env',
      );
    }
    if (!this.supabase) {
      this.supabase = createClient(url, key, {
        auth: { persistSession: false },
      });
    }
    return this.supabase;
  }

  private get bucket(): string {
    return process.env.SUPABASE_BUCKET || 'anexos';
  }

  async enviar(arquivo: Express.Multer.File): Promise<string> {
    const supabase = this.getClient();
    const caminho = `tarefas/${randomUUID()}${extname(arquivo.originalname).toLowerCase()}`;
    const { error } = await supabase.storage
      .from(this.bucket)
      .upload(caminho, arquivo.buffer, { contentType: arquivo.mimetype });
    if (error) throw new InternalServerErrorException(error.message);
    const { data } = supabase.storage.from(this.bucket).getPublicUrl(caminho);
    return data.publicUrl;
  }
}
