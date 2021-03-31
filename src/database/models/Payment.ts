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
  payload: {
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
        type: String || null,
        required: false
      },
      installment: {
        type: String || null,
        required: false
      },
      dueDate: String,
      value: Number,
      netValue: Number,
      billingType: String,
      status: String,
      description: String,
      externalReference: String,
      confirmedDate: String || null,
      originalValue: String || null,
      interestValue: String || null,
      originalDueDate: String,
      paymentDate: String || null,
      clientPaymentDate: String || null,
      invoiceUrl: String,
      bankSlipUrl: String,
      invoiceNumber: String,
      deleted: Boolean,
      creditCard: {
        creditCardNumber: String,
        creditCardBrand: String,
        creditCardToken: String
      } || null
    }
  }
})

const Payment = model<PaymentDocument>('Payment', paymentSchema)

export default Payment
