import { CrossmintWallets, createCrossmint } from "@crossmint/wallets-sdk";
import "dotenv/config";

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
        // For server-side operations where Crossmint manages the wallet's key,
        // the `api-key` signer is the simplest option.
        const wallet = await crossmintWallets.createWallet({
            chain: "solana",
            signer: {
                type: "api-key",
            },
        });

        console.log("[Crossmint Quickstart] ✅ Wallet created successfully!");
        console.log(`   - Chain: ${wallet.chain}`);
        console.log(`   - Address: ${wallet.address}`);

        // 3. Send a transaction from the newly created wallet
        const recipient = process.env.RECIPIENT_ADDRESS!;
        const amount = "0.001"; // Sending 0.001 SOL (devnet)

        console.log(`[Crossmint Quickstart] 💸 Sending ${amount} SOL to ${recipient.slice(0, 6)}...`);

        // The wallet.send() method simplifies token transfers.
        // It accepts a recipient address, a token identifier ('sol' for native, or a mint address for SPL tokens),
        // and the amount as a string to preserve precision.
        const transaction = await wallet.send(
            recipient,
            "sol",
            amount
        );

        console.log("[Crossmint Quickstart] ✅ Transaction sent successfully!");
        console.log(`   - Transaction Hash: ${transaction.id}`);
        console.log(`   - View on Explorer: ${transaction.explorerLink}`);

    } catch (error) {
        console.error("[Crossmint Quickstart] ❌ An error occurred:", error);
    }
}

main();
