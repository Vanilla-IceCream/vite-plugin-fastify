import type { Plugin } from 'vite';
import type { FastifyServerOptions } from 'fastify';
export interface VitePluginFastifyOptions {
    appPath: string;
    serverPath: string;
    fastify?: FastifyServerOptions;
}
declare const _default: (options: VitePluginFastifyOptions) => Plugin;
export default _default;
