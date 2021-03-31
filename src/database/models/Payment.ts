import mongoose from 'mongoose'
import PaymentDocument from '../interfaces/PaymentDocument'

const { Schema, model } = mongoose

const paymentSchema = new Schema({
  processed: {
    type: Boolean,
    required: true,
    default: false
  },
  scheduledInvoiceDate: {
    type: Date,
    required: true
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
      originalValue: String,
      interestValue: String,
      originalDueDate: String,
      paymentDate: String,
      clientPaymentDate: String,
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

const Payment = model<PaymentDocument>('Payment', paymentSchema)

export default Payment
