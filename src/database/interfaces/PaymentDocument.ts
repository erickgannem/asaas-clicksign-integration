import mongoose from 'mongoose'

export default interface PaymentDocument extends mongoose.Document {
  processed: boolean,
  scheduledInvoiceDate: Date,
  paymentData: {
    event: string,
    payment: {
      object: string,
      id: {
        type: string,
        unique: boolean
      },
      dateCreated: string,
      customer: string,
      subscription: {
        type: string,
        required: boolean
      },
      installment: {
        type: string,
        required: boolean
      },
      dueDate: string,
      value: number,
      netValue: number,
      billingType: string,
      status: string,
      description: string,
      externalReference: string,
      confirmedDate: string
      originalValue: string,
      interestValue: string,
      originalDueDate: string,
      paymentDate: string,
      clientPaymentDate: string,
      invoiceUrl: string,
      bankSlipUrl: string,
      invoiceNumber: string,
      deleted: boolean,
      creditCard: {
        creditCardNumber: string,
        creditCardBrand: string,
        creditCardToken: string
      }
    }
  }
}
