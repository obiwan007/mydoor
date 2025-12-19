import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface CodesFile {
  validCodes: string[];
}

@Injectable()
export class CodeService {
  private readonly logger = new Logger(CodeService.name);
  private cache: CodesFile | null = null;

  private getCodesFromEnv(): string[] {
    const raw = process.env.VALID_CODES;
    if (!raw) return [];
    const parts = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (parts.length > 0) {
      this.logger.log(`Loaded valid codes from environment (count=${parts.length}).`);
    }
    return parts;
  }

  private async loadCodes(): Promise<CodesFile> {
    if (this.cache) {
      return this.cache;
    }
    // Prefer environment variable VALID_CODES if provided
    const envCodes = this.getCodesFromEnv();
    if (envCodes.length > 0) {
      this.cache = { validCodes: envCodes };
      return this.cache;
    }
    // In the bundled build, __dirname points to dist/apps/nestjs-mydoor
    // where assets are emitted under ./assets
    // Fall back to alternative locations if needed.
    const candidates = [
      join(__dirname, 'assets', 'codes.json'),
      join(__dirname, '..', '..', 'assets', 'codes.json'),
    ];
    try {
      let lastErr: unknown = null;
      for (const p of candidates) {
        try {
          const data = await readFile(p, 'utf-8');
          const parsed: CodesFile = JSON.parse(data);
          this.cache = parsed;
          return parsed;
        } catch (e) {
          lastErr = e;
          continue;
        }
      }
      throw lastErr ?? new Error('codes.json not found');
    } catch (err) {
      this.logger.error(`Failed to read codes.json from known locations: ${err}`);
      return { validCodes: [] };
    }
  }

  async validateCode(code: string): Promise<boolean> {
    const codes = await this.loadCodes();
    this.logger.log(`Validating code: ${code}`);
    return codes.validCodes.includes(code);
  }
}
