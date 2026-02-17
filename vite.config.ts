import type { IncomingMessage, ServerResponse } from 'node:http';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

type VercelLikeReq = IncomingMessage & { body?: unknown };

type VercelLikeRes = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => VercelLikeRes;
  json: (payload: unknown) => VercelLikeRes;
};

type ApiHandler = (req: VercelLikeReq, res: VercelLikeRes) => Promise<unknown> | unknown;

let chatHandlerPromise: Promise<ApiHandler> | null = null;
let feedbackHandlerPromise: Promise<ApiHandler> | null = null;
let leaderboardHandlerPromise: Promise<ApiHandler> | null = null;
const chatModuleUrl = pathToFileURL(resolve(process.cwd(), 'api/chat.js')).href;
const feedbackModuleUrl = pathToFileURL(resolve(process.cwd(), 'api/feedback.js')).href;
const leaderboardModuleUrl = pathToFileURL(resolve(process.cwd(), 'api/leaderboard.js')).href;

function loadChatHandler() {
  if (!chatHandlerPromise) {
    chatHandlerPromise = import(chatModuleUrl).then((mod) => mod.default as ApiHandler);
  }

  return chatHandlerPromise;
}

function loadFeedbackHandler() {
  if (!feedbackHandlerPromise) {
    feedbackHandlerPromise = import(feedbackModuleUrl).then((mod) => mod.default as ApiHandler);
  }

  return feedbackHandlerPromise;
}

function loadLeaderboardHandler() {
  if (!leaderboardHandlerPromise) {
    leaderboardHandlerPromise = import(leaderboardModuleUrl).then((mod) => mod.default as ApiHandler);
  }

  return leaderboardHandlerPromise;
}

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk) => {
      chunks.push(Buffer.from(chunk));
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', reject);
  });
}

function createLocalApiPlugin(): Plugin {
  return {
    name: 'dualium-local-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? '';
        const handler: ApiHandler | null =
          pathname === '/api/chat'
            ? await loadChatHandler()
            : pathname === '/api/feedback'
              ? await loadFeedbackHandler()
              : pathname === '/api/leaderboard'
                ? await loadLeaderboardHandler()
                : null;

        if (!handler) {
          next();
          return;
        }

        const request = req as VercelLikeReq;
        const method = (request.method ?? 'GET').toUpperCase();

        if (method !== 'GET' && method !== 'HEAD') {
          const rawBody = await readBody(request);
          if (rawBody) {
            try {
              request.body = JSON.parse(rawBody) as unknown;
            } catch {
              request.body = rawBody;
            }
          }
        }

        const response: VercelLikeRes = {
          setHeader(name, value) {
            res.setHeader(name, value);
          },
          status(code) {
            res.statusCode = code;
            return response;
          },
          json(payload) {
            if (!res.headersSent) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
            }
            res.end(JSON.stringify(payload));
            return response;
          },
        };

        try {
          await handler(request, response);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Internal Server Error';
          response.status(500).json({ error: message });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), createLocalApiPlugin()],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-markdown') || id.includes('remark-gfm')) {
                return 'vendor-markdown';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('@tanstack')) {
                return 'vendor-query';
              }
              if (id.includes('i18next') || id.includes('react-i18next')) {
                return 'vendor-i18n';
              }
              if (id.includes('react') || id.includes('scheduler')) {
                return 'vendor-react';
              }
            }

            if (id.includes('/src/data/')) {
              return 'app-data';
            }

            return undefined;
          },
        },
      },
    },
    server: {
      host: true,
      strictPort: false,
    },
  };
});
