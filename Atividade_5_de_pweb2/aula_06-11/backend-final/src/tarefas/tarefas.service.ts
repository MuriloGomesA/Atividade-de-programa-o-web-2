import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { Tarefa } from './entities/tarefa.entity';
import { StorageService } from '../storage/storage.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TarefasService {
  constructor(
    @InjectRepository(Tarefa)
    private readonly tarefasRepository: Repository<Tarefa>,
    private readonly storage: StorageService,
    private readonly mail: MailService,
  ) {}

  async findAll(): Promise<Tarefa[]> {
    return this.tarefasRepository.find();
  }

  async findOne(id: number): Promise<Tarefa> {
    const tarefa = await this.tarefasRepository.findOneBy({ id });

    if (!tarefa) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return tarefa;
  }

  async create(dto: CreateTarefaDto, emailUsuario?: string): Promise<Tarefa> {
    const nova = this.tarefasRepository.create({
      titulo: dto.titulo,
      descricao: dto.descricao,
      concluida: false,
    });

    const tarefa = await this.tarefasRepository.save(nova);

    if (emailUsuario) {
      this.mail
        .tarefaCriada(emailUsuario, tarefa.titulo)
        .catch((e) => console.error('Falha ao enviar e-mail:', e.message));
    }

    return tarefa;
  }

  async anexar(id: number, arquivo: Express.Multer.File): Promise<Tarefa> {
    const tarefa = await this.findOne(id);

    tarefa.anexoUrl = await this.storage.enviar(arquivo);

    return this.tarefasRepository.save(tarefa);
  }

  async update(id: number, dto: UpdateTarefaDto): Promise<Tarefa> {
    const tarefa = await this.findOne(id);

    Object.assign(tarefa, dto);

    return this.tarefasRepository.save(tarefa);
  }

  async remove(id: number): Promise<void> {
    const tarefa = await this.findOne(id);

    await this.tarefasRepository.remove(tarefa);
  }
}