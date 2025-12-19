import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeController } from './code/code.controller';
import { CodeService } from './code/code.service';
import { HaService } from './ha/ha.service';

@Module({
  imports: [],
  controllers: [AppController, CodeController],
  providers: [AppService, CodeService, HaService],
})
export class AppModule {}
