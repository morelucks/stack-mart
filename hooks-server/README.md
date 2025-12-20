# StackMart Chainhook Server

This server receives and processes chainhook events from Hiro Chainhooks for the StackMart marketplace contract.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (optional):
```bash
export PORT=3001
export CHAINHOOK_SECRET=your-secret-key
```

3. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## Endpoints

- `POST /api/chainhooks/stack-mart` - Webhook endpoint for Hiro Chainhooks
- `GET /api/events` - Get recent events (supports query params: limit, contract, function)
- `GET /api/events/tx/:txid` - Get event for specific transaction
- `GET /health` - Health check endpoint

## Chainhook Configuration

1. Update the chainhook YAML files in `ops/chainhooks/` with your webhook URL
2. Deploy the chainhook server to a public URL
3. Register the chainhook with Hiro Chainhooks service

## Usage

The frontend uses the `useChainhooks` hook to fetch and display real-time marketplace events.

