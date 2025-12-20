#!/usr/bin/env node

/**
 * StackMart Chainhook Server
 * Receives and processes chainhook events from Hiro Chainhooks
 */

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;
const CHAINHOOK_SECRET = process.env.CHAINHOOK_SECRET || '';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Store events in memory (in production, use a database)
const events = [];

/**
 * Verify chainhook signature
 */
function verifySignature(payload, signature, secret) {
  if (!secret) return true; // Skip verification if no secret set
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const expectedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Process chainhook event
 */
function processChainhookEvent(event) {
  const { apply, rollback } = event;
  
  if (apply && apply.length > 0) {
    apply.forEach(transaction => {
      const { transaction_identifier, operations } = transaction;
      
      operations.forEach(op => {
        if (op.operation === 'contract_call') {
          const { contract_identifier, function_name, function_args } = op;
          
          // Extract event data
          const eventData = {
            txid: transaction_identifier.hash,
            contract: contract_identifier,
            function: function_name,
            args: function_args,
            timestamp: new Date().toISOString(),
          };
          
          console.log('📦 StackMart Event:', JSON.stringify(eventData, null, 2));
          
          // Store event
          events.push(eventData);
          
          // Emit to connected clients via WebSocket (if implemented)
          // broadcastEvent(eventData);
        }
      });
    });
  }
  
  if (rollback && rollback.length > 0) {
    console.log('🔄 Rollback detected:', rollback.length, 'transactions');
    // Handle rollbacks if needed
  }
}

/**
 * Chainhook webhook endpoint
 */
app.post('/api/chainhooks/stack-mart', (req, res) => {
  try {
    const signature = req.headers['x-chainhook-signature'] || '';
    const payload = req.body;
    
    // Verify signature if secret is configured
    if (CHAINHOOK_SECRET && !verifySignature(payload, signature, CHAINHOOK_SECRET)) {
      console.warn('⚠️ Invalid chainhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process the chainhook event
    processChainhookEvent(payload);
    
    // Acknowledge receipt
    res.status(200).json({ 
      success: true, 
      message: 'Event processed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error processing chainhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get recent events
 */
app.get('/api/events', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const contract = req.query.contract;
  const functionName = req.query.function;
  
  let filteredEvents = events;
  
  if (contract) {
    filteredEvents = filteredEvents.filter(e => e.contract === contract);
  }
  
  if (functionName) {
    filteredEvents = filteredEvents.filter(e => e.function === functionName);
  }
  
  res.json({
    events: filteredEvents.slice(-limit).reverse(),
    total: filteredEvents.length
  });
});

/**
 * Get events for a specific transaction
 */
app.get('/api/events/tx/:txid', (req, res) => {
  const { txid } = req.params;
  const event = events.find(e => e.txid === txid);
  
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    events_count: events.length,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 StackMart Chainhook Server running on port ${PORT}`);
  console.log(`📡 Listening for chainhook events at http://localhost:${PORT}/api/chainhooks/stack-mart`);
  console.log(`📊 View events at http://localhost:${PORT}/api/events`);
});

