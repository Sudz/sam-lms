import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { auth } from './config/auth';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { env, ensureEnv } from './config/env';
import { verifyDatabaseConnection } from './config/database';
import accountRoutes from './routes/accountRoutes';

ensureEnv();

const app = express();

if (env.isProduction) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(cors({
  origin: env.trustedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const handleAuthRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const protocol = req.protocol || (req.secure ? 'https' : 'http');
    const host = req.get('host') ?? env.authBaseUrl;
    const url = `${protocol}://${host}${req.originalUrl}`;

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (!value) continue;

      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }

    const init: RequestInit = {
      method: req.method,
      headers,
    };

    if (!['GET', 'HEAD'].includes(req.method.toUpperCase())) {
      let body: BodyInit | null = null;

      if (req.body === undefined || req.body === null) {
        body = null;
      } else if (typeof req.body === 'string') {
        body = req.body;
      } else if (Buffer.isBuffer(req.body)) {
        body = req.body;
      } else {
        body = JSON.stringify(req.body);
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/json');
        }
      }

      if (body !== null) {
        init.body = body;
        (init as any).duplex = 'half';
      }
    }

    const response = await auth.handler(new Request(url, init));

    const setCookies = (response.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.();
    if (setCookies && setCookies.length) {
      res.setHeader('set-cookie', setCookies);
    }

    response.headers.forEach((value: string, key: string) => {
      if (key.toLowerCase() === 'set-cookie') {
        return;
      }
      res.setHeader(key, value);
    });

    res.status(response.status);

    if (response.status === 204) {
      res.end();
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      res.end();
      return;
    }

    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    next(error);
  }
};

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/auth' || req.path.startsWith('/auth/')) {
    void handleAuthRequest(req, res, next);
    return;
  }

  next();
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'LMS API is running' });
});

app.use(authRoutes);
app.use(accountRoutes);
app.use(courseRoutes);
app.use(enrollmentRoutes);
app.use(paymentRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await verifyDatabaseConnection();
    app.listen(env.port, () => {
      console.log(`[server] Running on port ${env.port}`);
    });
  } catch (error) {
    console.error('[server] Failed to start', error);
    process.exit(1);
  }
};

void startServer();

export default app;
