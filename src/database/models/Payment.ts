import mongoose from 'mongoose'
import PaymentDoc from '../interfaces/PaymentDoc'

const { Schema, model } = mongoose

const paymentSchema = new Schema({
  processed: {
    type: Boolean,
    required: true,
    default: false
  },
  paymentData: {
    event: String,
    payment: {
      object: String,
      id: {
        type: String,
        unique: true
      },
      dateCreated: String,
      customer: String,
      subscription: {
        type: String,
        required: false
      },
      installment: {
        type: String,
        required: false
      },
      dueDate: String,
      value: Number,
      netValue: Number,
      billingType: String,
      status: String,
      description: String,
      externalReference: String,
      confirmedDate: String,
      originalValue: {
        type: Schema.Types.Mixed,
        default: null
      },
      interestValue: {
        type: Schema.Types.Mixed,
        default: null
      },
      originalDueDate: String,
      paymentDate: {
        type: Schema.Types.Mixed,
        default: null
      },
      clientPaymentDate: {
        type: Schema.Types.Mixed,
        default: null
      },
      invoiceUrl: String,
      bankSlipUrl: String,
      invoiceNumber: String,
      deleted: Boolean,
      creditCard: {
        creditCardNumber: String,
        creditCardBrand: String,
        creditCardToken: String
      }
    }
  }
})

const Payment = model<PaymentDoc>('Payment', paymentSchema)

export default Payment
