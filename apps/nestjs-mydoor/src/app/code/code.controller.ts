import { Body, Controller, Post } from '@nestjs/common';
import { CodeService } from './code.service';

class SubmitCodeDto {
  code!: string;
}

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post('submit')
  async submit(@Body() body: SubmitCodeDto) {
    const ok = await this.codeService.validateCode(body.code);
    return { success: ok };
  }
}
