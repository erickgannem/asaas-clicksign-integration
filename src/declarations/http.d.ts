declare module 'http' {
  export interface IncomingMessage {
    rawBody: any,
    asaasClient: any,
    clicksignDocumentData: any,
    clicksignDocumentKey: string,
    asaasPaymentInformation: any,
    unprocessedPayments: Array,
    paymentsReadyToInvoice: Array,

  }
}
