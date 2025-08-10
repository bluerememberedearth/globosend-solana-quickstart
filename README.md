# globosend-solana-quickstart
This repository provides a simple, runnable Node.js example demonstrating how to use the Crossmint Wallets SDK to perform core actions on the Solana blockchain.

This script will:
1.  Create a new, server-side custodial wallet on Solana Devnet.
2.  Use that wallet to send a small amount of devnet SOL to a specified recipient address.

## Prerequisites

1.  **Node.js** (v18 or later).
2.  A **Crossmint Developer Account**. You can sign up on the [Staging Console](https://staging.crossmint.com/console).
3.  A **Server-Side API Key** from your Crossmint project with the following scopes enabled:
    *   `wallets.create`
    *   `wallets:transactions.create`

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bluerememberedearth/globosend-solana-quickstart.git
    cd globosend-solana-quickstart
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure your environment:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and add your Crossmint Server-Side API Key:
    ```env
    # .env
    CROSSMINT_API_KEY="sk_staging_..."
    RECIPIENT_ADDRESS="<your_solana_recipient_address>"
    ```
    Replace `<your_solana_recipient_address>` with any Solana address you'd like to send the test transaction to.

## Running the Script

Execute the script from your terminal:

```bash
npm start
```

## What to Expect

The script will log its progress to the console. A successful run will look like this:

```
[Crossmint Quickstart] 🚀 Starting wallet creation...
[Crossmint Quickstart] ✅ Wallet created successfully!
   - Chain: solana
   - Address: Bx...mG
[Crossmint Quickstart] 💸 Sending 0.001 SOL to ...
[Crossmint Quickstart] ✅ Transaction sent successfully!
   - Transaction Hash: 2T...xY
   - View on Explorer: https://explorer.solana.com/tx/2T...xY?cluster=devnet
```

## Code Breakdown

The core logic is in `src/index.ts`.

### 1. Initialization
We import the SDK and load our API key from the environment variables.

```typescript
import { CrossmintWallets, createCrossmint } from "@crossmint/wallets-sdk";
import "dotenv/config";

const crossmint = createCrossmint({
    apiKey: process.env.CROSSMINT_API_KEY!,
});

const crossmintWallets = CrossmintWallets.from(crossmint);
```

### 2. Wallet Creation
We call `createWallet` for the `solana` chain. For server-side operations where Crossmint manages the key, the `api-key` signer is used.

```typescript
const wallet = await crossmintWallets.createWallet({
    chain: "solana",
    signer: {
        type: "api-key",
    },
});
```

### 3. Sending a Transaction
The `wallet.send()` method provides a high-level interface for transfers. You simply specify the recipient, the token symbol (e.g., `sol` or `usdc`), and the amount. The SDK handles the underlying transaction construction.

```typescript
const recipient = process.env.RECIPIENT_ADDRESS!;
const transaction = await wallet.send(
    recipient, // The destination address
    "sol",     // Token symbol. For USDC, you'd use its mint address.
    "0.001"    // The amount to send in decimal format.
);
```
This example is easily adaptable for sending USDC by changing the token identifier from `"sol"` to the USDC mint address for the desired network.
