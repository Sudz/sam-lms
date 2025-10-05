import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Application {
    use(...handlers: any[]): this;
  }

  interface Router {
    use(...handlers: any[]): this;
  }
}

export {};
