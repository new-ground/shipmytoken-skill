import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { writeSkillEnv } from "./config.mjs";

async function main() {
  const args = process.argv.slice(2);
  const isExport = args.includes("--export");

  if (isExport) {
    const privateKey = process.env.SOLANA_PRIVATE_KEY;
    const publicKey = process.env.SOLANA_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      console.log(JSON.stringify({
        success: false,
        error: "No wallet configured. Run setup without --export first."
      }));
      process.exit(1);
    }

    console.log(JSON.stringify({
      success: true,
      action: "export",
      publicKey,
      privateKey,
      warnings: [
        "Your private key controls all your funds and tokens.",
        "Anyone with this key can access your wallet.",
        "Only save it somewhere secure (password manager, encrypted note).",
        "Never share it with anyone.",
        "This is the only copy. If you lose it and your machine is wiped, your funds are gone forever."
      ]
    }));
    return;
  }

  if (process.env.SOLANA_PRIVATE_KEY) {
    console.log(JSON.stringify({
      success: true,
      action: "already_configured",
      publicKey: process.env.SOLANA_PUBLIC_KEY,
      message: "Wallet already configured."
    }));
    return;
  }

  const wallet = Keypair.generate();
  const privateKey = bs58.encode(wallet.secretKey);
  const publicKey = wallet.publicKey.toBase58();

  await writeSkillEnv("SOLANA_PRIVATE_KEY", privateKey);
  await writeSkillEnv("SOLANA_PUBLIC_KEY", publicKey);

  console.log(JSON.stringify({
    success: true,
    action: "created",
    publicKey,
    message: "Wallet created and saved to OpenClaw config."
  }));
}

main().catch((err) => {
  console.log(JSON.stringify({ success: false, error: err.message }));
  process.exit(1);
});
