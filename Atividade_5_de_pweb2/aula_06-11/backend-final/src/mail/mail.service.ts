import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

@Injectable()
export class MailService {
  private resend: Resend | null = null;

  private getClient(): Resend | null {
    const chave = process.env.RESEND_API_KEY;
    if (!chave) return null;
    if (!this.resend) this.resend = new Resend(chave);
    return this.resend;
  }

  async tarefaCriada(para: string, titulo: string) {
    const client = this.getClient();
    if (!client) {
      console.warn('RESEND_API_KEY não configurada: e-mail não enviado.');
      return;
    }
    const { error } = await client.emails.send({
      from: process.env.MAIL_FROM || 'Tarefas <onboarding@resend.dev>',
      to: para,
      subject: 'Nova tarefa criada',
      html: `<p>Sua tarefa <b>${escapar(titulo)}</b> foi criada.</p>`,
    });
    if (error) throw new Error(error.message);
  }
}
