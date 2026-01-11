export interface MetiganModuleOptions {
  apiKey: string;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  debug?: boolean;
}

export interface MetiganModuleAsyncOptions {
  useFactory?: (...args: any[]) => Promise<MetiganModuleOptions> | MetiganModuleOptions;
  inject?: any[];
}

