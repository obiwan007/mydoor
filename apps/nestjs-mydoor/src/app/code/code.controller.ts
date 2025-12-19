import { Body, Controller, Post, Logger } from '@nestjs/common';
import { CodeService } from './code.service';
import { HaService } from '../ha/ha.service';
import axios from 'axios';

class SubmitCodeDto {
  code!: string;
}

@Controller('code')
export class CodeController {
  private readonly logger = new Logger(CodeController.name);
  constructor(
    private readonly codeService: CodeService,
    private readonly ha: HaService,
  ) {}

  @Post('submit')
  async submit(@Body() body: SubmitCodeDto) {
    const ok = await this.codeService.validateCode(body.code);
    if (!ok) {
      return { success: false };
    }

    let haSuccess = false;
    let haStatus: number | undefined;
    try {
      await this.ha.callService('switch', 'turn_on', {
        entity_id: 'switch.bot_1cb7',
      });
      haSuccess = true;
    } catch (err) {
      this.logger.error(`Failed to turn on HA entity switch.bot_1cb7: ${err}`);
      if (axios.isAxiosError(err)) {
        haStatus = err.response?.status;
      }
    }

    return { success: true, haSuccess, haStatus };
  }
}
