// index.ts

import { CrossmintWallets, createCrossmint } from "@crossmint/wallets-sdk";
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import "dotenv/config";

// --- Helper function to request and confirm a Solana airdrop ---
// This is the key addition to solve the "cold start" wallet problem.
async function fundWalletWithAirdrop(walletAddress: string) {
    // Connect to the Solana devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const publicKey = new PublicKey(walletAddress);

    console.log(`[Crossmint Quickstart] 💧 Requesting airdrop of 1 SOL to ${walletAddress}...`);

    // Request 1 SOL (1 SOL = 1,000,000,000 LAMPORTS)
    const airdropSignature = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);

    console.log(`[Crossmint Quickstart] ⏳ Waiting for airdrop transaction to be confirmed...`);
    console.log(`   - Airdrop Signature: ${airdropSignature}`);

    // Confirm the transaction
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
        signature: airdropSignature,
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
    });

    console.log("[Crossmint Quickstart] ✅ Airdrop confirmed!");
}

// Function to validate that required environment variables are set
function validateEnv() {
    if (!process.env.CROSSMINT_API_KEY) {
        throw new Error("Missing CROSSMINT_API_KEY in .env file");
    }
    if (!process.env.RECIPIENT_ADDRESS) {
        throw new Error("Missing RECIPIENT_ADDRESS in .env file");
    }
}

async function main() {
    validateEnv();

    console.log("[Crossmint Quickstart] 🚀 Starting wallet creation...");

    try {
        // 1. Initialize the Crossmint SDKs
        const crossmint = createCrossmint({
            apiKey: process.env.CROSSMINT_API_KEY!,
        });
        const crossmintWallets = CrossmintWallets.from(crossmint);

        // 2. Create a server-side custodial wallet on Solana
        const wallet = await crossmintWallets.createWallet({
            chain: "solana",
            signer: {
                type: "api-key",
            },
        });

        console.log("[Crossmint Quickstart] ✅ Wallet created successfully!");
        console.log(`   - Chain: ${wallet.chain}`);
        console.log(`   - Address: ${wallet.address}`);

        // 3. Fund the new wallet with Devnet SOL
        // This new step ensures the wallet has funds for transaction fees.
        await fundWalletWithAirdrop(wallet.address);

        // 4. Send a transaction from the newly created and funded wallet
        const recipient = process.env.RECIPIENT_ADDRESS!;
        const amount = "0.001"; // Sending 0.001 SOL (devnet)

        console.log(`[Crossmint Quickstart] 💸 Sending ${amount} SOL to ${recipient.slice(0, 6)}...`);

        const transaction = await wallet.send(
            recipient,
            "sol", // 'sol' for native token, or a mint address for SPL tokens
            amount
        );

        console.log("[Crossmint Quickstart] ✅ Transaction sent successfully!");
        console.log(`   - Transaction Hash: ${transaction.hash}`);
        console.log(`   - View on Explorer: ${transaction.explorerLink}`);
    } catch (error) {
        console.error("[Crossmint Quickstart] ❌ An error occurred:", error);
    }
}

main();
