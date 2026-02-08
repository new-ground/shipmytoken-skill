import { readFile, writeFile, mkdir, rename } from "fs/promises";
import { join, dirname } from "path";
import { homedir } from "os";

const SMT_DIR = join(homedir(), ".shipmytoken");
const SMT_CONFIG = join(SMT_DIR, "config.json");
const SMT_TOKENS = join(SMT_DIR, "tokens.json");

export async function readConfig() {
  try {
    const raw = await readFile(SMT_CONFIG, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function writeConfig(key, value) {
  const config = await readConfig();
  config[key] = value;

  await mkdir(SMT_DIR, { recursive: true });
  const tmp = SMT_CONFIG + ".tmp";
  await writeFile(tmp, JSON.stringify(config, null, 2) + "\n");
  await rename(tmp, SMT_CONFIG);
}

export async function getKey(name) {
  if (process.env[name]) return process.env[name];
  const config = await readConfig();
  return config[name] || null;
}

export async function readTokenHistory() {
  try {
    const raw = await readFile(SMT_TOKENS, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { tokens: [] };
  }
}

export async function writeTokenHistory(data) {
  await mkdir(SMT_DIR, { recursive: true });
  const tmp = SMT_TOKENS + ".tmp";
  await writeFile(tmp, JSON.stringify(data, null, 2) + "\n");
  await rename(tmp, SMT_TOKENS);
}
