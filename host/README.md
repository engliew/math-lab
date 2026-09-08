# Math Lab host pack (610ecdc)

- Origin SHA: `610ecdc4cb75d7a43b369d3445e3aadabc757f54`
- sha256: `d01a373fb052f9ecd17eca052036c023cf8e89c199c3911bfffa21a09b50ecac`
- bytes: `24106576`
- 49 parts (`host/part_00.b64` … `host/part_48.b64`)

## Reconstruct on EC2

```bash
mkdir -p /tmp/ml && cd /tmp/ml
for i in $(seq -f '%02g' 0 48); do
  curl -fsSL -o "part_${i}.b64" \
    "https://raw.githubusercontent.com/engliew/math-lab/cursor/host-pack-610ecdc-2932/host/part_${i}.b64"
done
cat part_*.b64 | base64 -d > /tmp/mathlab-610ecdc-host.tgz
echo "d01a373fb052f9ecd17eca052036c023cf8e89c199c3911bfffa21a09b50ecac  /tmp/mathlab-610ecdc-host.tgz" | sha256sum -c
```

Do not touch Meridian `AUTH_SECRET`. Use Math Lab's own `MATHLAB_SESSION_SECRET`.
