import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiError } from '../errors';
import { MetiganModuleOptions } from '../interfaces/metigan-module-options.interface';

const BASE_URL = 'https://api.metigan.com';

@Injectable()
export class HttpClientService {
  private readonly client: AxiosInstance;
  private readonly config: MetiganModuleOptions;

  constructor(
    @Inject('METIGAN_MODULE_OPTIONS') config: MetiganModuleOptions,
  ) {
    this.config = config;

    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'User-Agent': 'Metigan-NestJS-SDK/1.0',
      },
    });

    // Add request interceptor for retry logic
    this.setupRetryInterceptor();
  }

  private setupRetryInterceptor() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        
        // Don't retry if retry count exceeded
        if (!config || config.__retryCount >= (this.config.retryCount || 3)) {
          return Promise.reject(error);
        }

        // Only retry on 5xx errors
        if (error.response && error.response.status >= 500) {
          config.__retryCount = config.__retryCount || 0;
          config.__retryCount += 1;

          const delay = (this.config.retryDelay || 2000) * config.__retryCount;
          await new Promise((resolve) => setTimeout(resolve, delay));

          return this.client(config);
        }

        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, {
        ...config,
        data: config?.data,
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      const { status, data } = error.response;
      return new ApiError(
        status,
        data?.message || data?.error || error.message,
        data?.error,
      );
    }
    return new ApiError(0, error.message);
  }
}

