import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game } from '@prisma/client';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number, take: number): Promise<Game[]> {
    return this.prisma.game.findMany({ skip, take });
  }

  async findRandom(): Promise<Game> {
    const count = await this.prisma.game.count();
    const skip = Math.max(0, Math.floor(Math.random() * count) - 1);
    return this.prisma.game.findFirst({
      take: 1,
      skip,
    });
  }

  async findOne(id: string): Promise<Game | null> {
    return this.prisma.game.findFirst({
      where: { id },
    });
  }
}
