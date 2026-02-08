import { readFile, writeFile, mkdir, rename } from "fs/promises";
import { join, dirname } from "path";
import { homedir } from "os";

const OPENCLAW_DIR = join(homedir(), ".openclaw");
const OPENCLAW_CONFIG = join(OPENCLAW_DIR, "openclaw.json");

export async function readOpenClawConfig() {
  try {
    const raw = await readFile(OPENCLAW_CONFIG, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { skills: { entries: {} } };
  }
}

export async function writeSkillEnv(key, value) {
  const config = await readOpenClawConfig();
  if (!config.skills) config.skills = { entries: {} };
  if (!config.skills.entries) config.skills.entries = {};
  if (!config.skills.entries.shipmytoken) config.skills.entries.shipmytoken = { env: {} };
  if (!config.skills.entries.shipmytoken.env) config.skills.entries.shipmytoken.env = {};

  config.skills.entries.shipmytoken.env[key] = value;

  await mkdir(OPENCLAW_DIR, { recursive: true });
  const tmp = OPENCLAW_CONFIG + ".tmp";
  await writeFile(tmp, JSON.stringify(config, null, 2) + "\n");
  await rename(tmp, OPENCLAW_CONFIG);
}

export function getWorkspacePath() {
  const workspace = process.env.OPENCLAW_WORKSPACE || process.env.WORKSPACE_DIR;
  if (!workspace) {
    throw new Error("No workspace directory found. Set OPENCLAW_WORKSPACE or WORKSPACE_DIR.");
  }
  return join(workspace, "shipmytoken");
}

function getTokensPath() {
  return join(getWorkspacePath(), "tokens.json");
}

export async function readTokenHistory() {
  try {
    const raw = await readFile(getTokensPath(), "utf-8");
    return JSON.parse(raw);
  } catch {
    return { tokens: [] };
  }
}

export async function writeTokenHistory(data) {
  const tokensPath = getTokensPath();
  await mkdir(dirname(tokensPath), { recursive: true });
  const tmp = tokensPath + ".tmp";
  await writeFile(tmp, JSON.stringify(data, null, 2) + "\n");
  await rename(tmp, tokensPath);
}
