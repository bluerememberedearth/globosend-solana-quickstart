# globosend-solana-quickstart

This repository provides a simple, runnable Node.js example demonstrating how to use the Crossmint Wallets SDK to perform core actions on the Solana blockchain, including automatically funding the wallet with devnet SOL.

This script will:

1.  Create a new, server-side custodial wallet on Solana Devnet.
2.  **Request an airdrop of 1 SOL from the Solana Devnet faucet to the newly created wallet.**
3.  Use that wallet to send a small amount of devnet SOL to a specified recipient address.

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

    Create an `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Now, open the `.env` file and add your Crossmint Server-Side API Key and a recipient address:

    ```env
    # .env
    CROSSMINT_API_KEY="sk_staging_..."
    RECIPIENT_ADDRESS="<your_solana_recipient_address>"
    ```

    Your API Key can be found in your Crossmint Staging Console. Replace `<your_solana_recipient_address>` with any Solana address you'd like to send the test transaction to.

## Running the Script

Execute the script from your terminal:

```bash
npm start
