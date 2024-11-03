import mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema({
  burnAmount: Number,
  timestamp: { type: Date, default: Date.now },
  txHash: String
})

export const Token = mongoose.model('Token', tokenSchema) 