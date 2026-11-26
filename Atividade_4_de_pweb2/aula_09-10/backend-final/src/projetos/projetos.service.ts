
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { Projeto } from './entities/projeto.entity';

@Injectable()
export class ProjetosService {
  private projetos: Projeto[] = [
    {
      id: 1,
      nome: 'Faculdade',
      descricao: 'Projeto de estudos',
      cor: 'azul',
    },
    {
      id: 2,
      nome: 'Trabalho',
      descricao: 'Projeto profissional',
      cor: 'verde',
    },
  ];

  private proximoId = 3;

  create(createProjetoDto: CreateProjetoDto): Projeto {
    const novoProjeto: Projeto = {
      id: this.proximoId++,
      ...createProjetoDto,
    };

    this.projetos.push(novoProjeto);

    return novoProjeto;
  }

  findAll(): Projeto[] {
    return this.projetos;
  }

  findOne(id: number): Projeto {
    const projeto = this.projetos.find((p) => p.id === id);

    if (!projeto) {
      throw new NotFoundException(
        `Projeto com ID ${id} não encontrado`,
      );
    }

    return projeto;
  }

  update(
    id: number,
    updateProjetoDto: UpdateProjetoDto,
  ): Projeto {
    const projeto = this.findOne(id);

    Object.assign(projeto, updateProjetoDto);

    return projeto;
  }

  remove(id: number): void {
    this.findOne(id);

    this.projetos = this.projetos.filter((p) => p.id !== id);
  }
}
