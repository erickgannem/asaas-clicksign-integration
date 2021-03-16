import mongoose from 'mongoose'

const { Schema, model } = mongoose

const paymentSchema = new Schema({
  processed: {
    type: Boolean,
    required: true
  },
  paymentData: {
    type: {
      event: String,
      payment: {
        type: {
          object: String,
          id: String,
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
          confirmedDate: String
          // ...
        },
        required: true
      }
    },
    required: true
  }
})

const Payment = model('Payment', paymentSchema)

export default Payment
