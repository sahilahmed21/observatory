# Observatory Agent

The official monitoring agent for the Observatory API Performance Monitoring platform.

### Installation

```bash
npm install observatory-agent
```

Or with Yarn:

```bash
yarn add observatory-agent
```

Or with pnpm:

```bash
pnpm add observatory-agent
```

### Quick start

Add the agent as the first middleware in your Express app. Place it before your API routes so it can measure every request.

#### JavaScript (CommonJS)

```js
// In your main server file (e.g., index.js or server.js)
const express = require('express');
const { createObservatoryAgent } = require('observatory-agent');

const app = express();
const PORT = 3000;

// Initialize the agent with your API key from the Observatory dashboard
const observatoryMiddleware = createObservatoryAgent({
  apiKey: 'YOUR_API_KEY_HERE',
});

// Use the agent as the first middleware
app.use(observatoryMiddleware);

// Your API routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
  setTimeout(() => {
    res.json([{ id: 1, name: 'John Doe' }]);
  }, 150); // Simulate a 150ms delay
});

app.get('/api/products/:id', (req, res) => {
  res.status(404).send('Product not found');
});

app.listen(PORT, () => {
  console.log(`Sample app listening on port ${PORT}`);
});
```

#### JavaScript (ES Modules)

```js
// In your main server file (e.g., index.mjs)
import express from 'express';
import { createObservatoryAgent } from 'observatory-agent';

const app = express();
const PORT = 3000;

const observatoryMiddleware = createObservatoryAgent({
  apiKey: 'YOUR_API_KEY_HERE',
});

app.use(observatoryMiddleware);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Sample app listening on port ${PORT}`);
});
```

#### TypeScript

```ts
// In your main server file (e.g., src/server.ts)
import express, { Request, Response } from 'express';
import { createObservatoryAgent } from 'observatory-agent';

const app = express();
const PORT = 3000;

const observatoryMiddleware = createObservatoryAgent({
  apiKey: process.env.OBSERVATORY_API_KEY as string,
});

app.use(observatoryMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Sample app listening on port ${PORT}`);
});
```

### Configuration

Pass a configuration object to `createObservatoryAgent`:

- **apiKey (required)**: Your project's API key.
- **endpoint (optional)**: The Observatory backend endpoint. Defaults to `http://localhost:5001/api/metrics`.
- **batchInterval (optional)**: How often to send metrics (ms). Defaults to `15000` (15 seconds).
- **maxBatchSize (optional)**: Maximum number of buffered metrics before sending immediately. Defaults to `50`.

Example with options:

```js
const observatoryMiddleware = createObservatoryAgent({
  apiKey: 'YOUR_API_KEY_HERE',
  endpoint: 'https://your-observatory.example.com/api/metrics',
  batchInterval: 10000,
  maxBatchSize: 100,
});
```

### Best practices

- Place the agent middleware before all route handlers to capture complete timing data.
- Use a secure way to provide the API key (e.g., environment variables).
- Ensure the configured `endpoint` is reachable from your server environment.

### Troubleshooting

- **401/403 errors**: Verify the `apiKey` is correct and authorized for the target project.
- **Connection errors**: Check that `endpoint` is correct and network egress is allowed.
- **No metrics showing**: Confirm the middleware is mounted before your routes and traffic is hitting the server.

### License

MIT


