declare module "node:*" {
  const content: any;
  export = content;
}

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

// Override problematic HTTP2 types
declare module "http2" {
  const content: any;
  export = content;
}

// Override problematic stream types
declare module "stream/web" {
  const content: any;
  export = content;
} 