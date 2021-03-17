import mongoose from 'mongoose'

const { Schema, model } = mongoose

const paymentSchema = new Schema({
  processed: {
    type: Boolean,
    required: true,
    default: false
  },
  paymentData: Schema.Types.Mixed
})

const Payment = model('Payment', paymentSchema)

export default Payment
