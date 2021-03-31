import mongoose from 'mongoose'

export default interface PaymentDocument extends mongoose.Document {
  processed: boolean,
  scheduledInvoiceDate: Date,
  payload: {
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
        type: string | null,
        required: boolean
      },
      installment: {
        type: string | null,
        required: boolean
      },
      dueDate: string,
      value: number,
      netValue: number,
      billingType: string,
      status: string,
      description: string,
      externalReference: string,
      confirmedDate: string | null
      originalValue: string | null,
      interestValue: string | null,
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
      } | null
    }
  }
}
