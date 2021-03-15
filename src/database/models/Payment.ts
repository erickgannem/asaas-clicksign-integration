import mongoose from 'mongoose'

const { Schema, model } = mongoose

const paymentSchema = new Schema({
  processed: {
    type: Boolean,
    required: true
  },
  paymentData: {
  }
})
