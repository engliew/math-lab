import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, "out");
const distName = "mathlab.engliew.xyz";
const distDir = resolve(root, "dist", distName);
const tarball = resolve(root, "dist", `${distName}.tar.gz`);

if (!existsSync(outDir)) {
  console.error("Missing out/. Run npm run build first.");
  process.exit(1);
}

rmSync(resolve(root, "dist"), { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
cpSync(outDir, distDir, { recursive: true });
cpSync(
  resolve(root, "deploy/nginx-mathlab.engliew.xyz.conf"),
  resolve(distDir, "nginx-mathlab.engliew.xyz.conf"),
);

writeFileSync(
  resolve(distDir, "DEPLOY.txt"),
  [
    "Math Lab static site for https://mathlab.engliew.xyz",
    "",
    "Extract on the lab host:",
    "  sudo mkdir -p /opt/mathlab.engliew.xyz",
    "  sudo tar -xzf mathlab.engliew.xyz.tar.gz -C /opt",
    "",
    "Point nginx root at /opt/mathlab.engliew.xyz",
    "(see deploy/nginx-mathlab.engliew.xyz.conf in the git repo).",
    "",
    "No environment variables. Progress is browser localStorage.",
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
