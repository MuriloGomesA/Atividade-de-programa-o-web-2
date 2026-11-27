import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { Tarefa } from './entities/tarefa.entity';

@Injectable()
export class TarefasService {
  constructor(
    @InjectRepository(Tarefa)
    private readonly tarefasRepository: Repository<Tarefa>,
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

  async create(dto: CreateTarefaDto): Promise<Tarefa> {
    const nova = this.tarefasRepository.create({
      titulo: dto.titulo,
      descricao: dto.descricao,
      concluida: false,
    });

    return this.tarefasRepository.save(nova);
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