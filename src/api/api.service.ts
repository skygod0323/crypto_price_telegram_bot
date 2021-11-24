import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Setting } from './entities/setting.entity';

@Injectable()
export class ApiService {
  
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>
  ) {
  }

  async getSetting(key: string) {
      const value = await this.settingRepository.findOne({key: key});
      return value;
  }
}
