import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const standaloneRoot = resolve(root, ".next/standalone");
const distName = "mathlab";
const distDir = resolve(root, "dist", distName);
const tarball = resolve(root, "dist", `${distName}.tar.gz`);

if (!existsSync(standaloneRoot)) {
  console.error("Missing .next/standalone. Run npm run build first.");
  process.exit(1);
}

function findServerJs(dir, depth = 0) {
  if (depth > 4) return null;
  const entries = readdirSync(dir, { withFileTypes: true });
  if (entries.some((entry) => entry.isFile() && entry.name === "server.js")) {
    return dir;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "node_modules") continue;
    const found = findServerJs(resolve(dir, entry.name), depth + 1);
    if (found) return found;
  }
  return null;
}

const serverDir = findServerJs(standaloneRoot);
if (!serverDir) {
  console.error("Could not find server.js inside .next/standalone");
  process.exit(1);
}

rmSync(resolve(root, "dist"), { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
cpSync(serverDir, distDir, { recursive: true });

const staticDir = resolve(root, ".next/static");
if (existsSync(staticDir)) {
  mkdirSync(resolve(distDir, ".next"), { recursive: true });
  cpSync(staticDir, resolve(distDir, ".next/static"), { recursive: true });
}

const publicDir = resolve(root, "public");
if (existsSync(publicDir)) {
  cpSync(publicDir, resolve(distDir, "public"), { recursive: true });
}

cpSync(resolve(root, "deploy"), resolve(distDir, "deploy"), { recursive: true });

writeFileSync(
  resolve(distDir, "DEPLOY.txt"),
  [
    "Math Lab for https://mathlab.engliew.xyz",
    "Node standalone + SQLite. Extract to /opt/mathlab",
    "",
    "sudo mkdir -p /opt/mathlab/data",
    "sudo tar -xzf mathlab.tar.gz -C /opt",
    "sudo cp /opt/mathlab/deploy/mathlab.service /etc/systemd/system/",
    "sudo cp /opt/mathlab/deploy/nginx-mathlab.engliew.xyz.conf /etc/nginx/conf.d/",
    "sudo systemctl daemon-reload && sudo systemctl enable --now mathlab",
    "sudo nginx -t && sudo systemctl reload nginx",
    "",
    "MIGRATION: first start creates /opt/mathlab/data/mathlab.sqlite",
    "(001_users_sessions_progress). Keep the data/ folder on redeploy.",
    "",
    "Do not set AUTH_SECRET on this unit. That secret is Meridian only.",
    "Math Lab uses SQLite session tokens (cookie mathlab_session).",
    "",
  ].join("\n"),
);

const packed = spawnSync(
  "tar",
  ["-czf", tarball, "-C", resolve(root, "dist"), distName],
  { stdio: "inherit" },
);
if (packed.status !== 0) process.exit(packed.status ?? 1);

const artifacts = "/opt/cursor/artifacts";
if (existsSync(artifacts)) {
  cpSync(tarball, resolve(artifacts, `${distName}.tar.gz`));
}

console.log(`Packed ${tarball}`);
