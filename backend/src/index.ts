import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { config } from './config/config'
import { logger } from './utils/logger'
import tokenRoutes from './routes/tokenRoutes'
import roadmapRoutes from './routes/roadmapRoutes'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    query: req.query,
    body: req.body,
    ip: req.ip
  });
  next();
});

// Routes
app.use('/api', tokenRoutes)
app.use('/api', roadmapRoutes)

// MongoDB connection
mongoose.connect(config.mongoUri)
  .then(() => logger.info('Connected to MongoDB Atlas'))
  .catch(err => {
    logger.error('MongoDB connection error:', err)
    process.exit(1)
  })

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`)
  logger.info('Environment:', {
    nodeEnv: process.env.NODE_ENV,
    mongoUri: config.mongoUri.split('@')[1], // Log only the host part for security
    solanaRpc: config.apis.solanaRpc,
    port: config.port
  })
})

// Handle process events
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason })
})

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
}) 