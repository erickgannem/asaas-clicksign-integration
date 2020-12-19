declare module 'http' {
  interface IncomingMessage {
    rawBody: any,
    clients: any
  }
}
