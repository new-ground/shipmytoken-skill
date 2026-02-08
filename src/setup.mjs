import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readConfig, writeConfig, getKey } from "./config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCAL_VERSION = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf-8")
).version;

async function checkForUpdate() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/new-ground/shipmytoken-skill/releases/latest",
      { signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return null;
    const { tag_name } = await res.json();
    const latest = tag_name.replace(/^v/, "");
    if (latest !== LOCAL_VERSION) {
      return {
        current: LOCAL_VERSION,
        latest,
        message: `Update available: v${latest}. Run: npx skills add new-ground/shipmytoken-skill --all`
      };
    }
  } catch {
    // Network error or timeout — silently skip
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const isExport = args.includes("--export");

  if (isExport) {
    const privateKey = await getKey("SOLANA_PRIVATE_KEY");
    const publicKey = await getKey("SOLANA_PUBLIC_KEY");

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

  const updateInfo = await checkForUpdate();

  const config = await readConfig();
  if (config.SOLANA_PRIVATE_KEY || process.env.SOLANA_PRIVATE_KEY) {
    console.log(JSON.stringify({
      success: true,
      action: "already_configured",
      publicKey: config.SOLANA_PUBLIC_KEY || process.env.SOLANA_PUBLIC_KEY,
      version: LOCAL_VERSION,
      message: "Wallet already configured.",
      ...(updateInfo && { update: updateInfo })
    }));
    return;
  }

  const wallet = Keypair.generate();
  const privateKey = bs58.encode(wallet.secretKey);
  const publicKey = wallet.publicKey.toBase58();

  await writeConfig("SOLANA_PRIVATE_KEY", privateKey);
  await writeConfig("SOLANA_PUBLIC_KEY", publicKey);

  console.log(JSON.stringify({
    success: true,
    action: "created",
    publicKey,
    version: LOCAL_VERSION,
    message: "Wallet created and saved to ~/.shipmytoken/config.json",
    ...(updateInfo && { update: updateInfo })
  }));
}

main().catch((err) => {
  console.log(JSON.stringify({ success: false, error: err.message }));
  process.exit(1);
});
