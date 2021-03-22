import mongoose from 'mongoose'

export default interface PaymentDoc extends mongoose.Document {
  processed: {
    type: boolean,
    required: boolean,
    default: boolean
  },
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
      confirmedDate: string,
      originalValue: {
        type: mongoose.Schema.Types.Mixed,
        default: string
      },
      interestValue: {
        type: mongoose.Schema.Types.Mixed,
        default: string
      },
      originalDueDate: String,
      paymentDate: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },
      clientPaymentDate: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },
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
