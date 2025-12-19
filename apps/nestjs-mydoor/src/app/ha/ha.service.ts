import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as https from 'https';

@Injectable()
export class HaService {
  private readonly logger = new Logger(HaService.name);
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.loadEnvIfNeeded();
    const base = process.env.HA_BASE_URL || 'http://homeassistant.local:8123/';
    const token = process.env.HA_TOKEN || '';
    this.baseUrl = base.replace(/\/$/, '');

    const ignoreTls = (process.env.HA_IGNORE_TLS || '').toLowerCase() === 'true';
    this.client = axios.create({
      baseURL: `${this.baseUrl}/api`,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        : { 'Content-Type': 'application/json' },
      timeout: 8000,
      httpsAgent: ignoreTls ? new https.Agent({ rejectUnauthorized: false }) : undefined,
    });
  }

  private loadEnvIfNeeded() {
    // If variables are already present, do nothing
    if (process.env.HA_BASE_URL && process.env.HA_TOKEN) return;

    const candidates = [
      path.join(process.cwd(), 'apps', 'nestjs-mydoor', '.env'),
      path.join(process.cwd(), '.env'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        dotenv.config({ path: p });
        this.logger.log(`Loaded HA config from ${p}`);
        break;
      }
    }
  }

  async callService<T = unknown>(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<T> {
    try {
      const url = `/services/${domain}/${service}`;
      const res = await this.client.post<T>(url, data ?? {});
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const statusText = err.response?.statusText;
        const body = err.response?.data;
        this.logger.error(
          `HA call failed for ${domain}.${service}: ${status} ${statusText} ${JSON.stringify(body)}`,
        );
      } else {
        this.logger.error(`HA call failed for ${domain}.${service}: ${err}`);
      }
      throw err;
    }
  }

  async health(): Promise<unknown> {
    // /api/config requires authentication and is a good basic health check
    const res = await this.client.get('/config');
    return res.data;
  }
}
