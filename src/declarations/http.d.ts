declare module 'http' {
  interface IncomingMessage {
    rawBody: any,
    asaasClient: any
  }
}
