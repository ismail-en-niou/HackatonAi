# GPU Setup for Ollama

## Prerequisites

### 1. Install NVIDIA Drivers
Make sure you have NVIDIA GPU drivers installed on your host machine:
```bash
# Check if GPU is detected
nvidia-smi
```

### 2. Install NVIDIA Container Toolkit
```bash
# Add NVIDIA package repositories
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list

# Install nvidia-container-toolkit
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# Restart Docker
sudo systemctl restart docker
```

### 3. Configure Docker to Use NVIDIA Runtime
Edit `/etc/docker/daemon.json` (create if it doesn't exist):
```json
{
  "runtimes": {
    "nvidia": {
      "path": "nvidia-container-runtime",
      "runtimeArgs": []
    }
  },
  "default-runtime": "nvidia"
}
```

Then restart Docker:
```bash
sudo systemctl restart docker
```

## Verify GPU Setup

### Test NVIDIA Container Toolkit
```bash
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
```

You should see your GPU information.

## Start the Application with GPU

### Using Docker Compose
```bash
# Rebuild and start with GPU support
make restart

# Or manually
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Check Logs
```bash
# Check if GPU is detected
docker-compose logs ai | grep -i gpu

# Watch Ollama startup
docker-compose logs -f ai
```

You should see messages like:
- "GPU Info: NVIDIA GeForce RTX 3080" (or your GPU model)
- Ollama will automatically use GPU for inference

## Verify Ollama is Using GPU

### Monitor GPU Usage During Query
```bash
# In one terminal, watch GPU usage
watch -n 0.5 nvidia-smi

# In another terminal, send a query
curl -X POST http://localhost:3000/api/chats/query \
  -H "Content-Type: application/json" \
  -d '{"query":"test question"}'
```

You should see GPU memory and utilization increase during inference.

## Troubleshooting

### GPU Not Detected
1. **Check host GPU:**
   ```bash
   nvidia-smi
   ```

2. **Check Docker GPU access:**
   ```bash
   docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
   ```

3. **Check container GPU access:**
   ```bash
   docker exec -it llm-ai-1 nvidia-smi
   ```

### Ollama Still Using CPU
1. **Check Ollama GPU environment variables:**
   ```bash
   docker exec -it llm-ai-1 env | grep OLLAMA
   ```
   Should show: `OLLAMA_GPU=1`

2. **Check Ollama logs:**
   ```bash
   docker-compose logs ai | grep -i "gpu\|cuda"
   ```

3. **Manually test inside container:**
   ```bash
   docker exec -it llm-ai-1 bash
   ollama run qwen2.5:3b "hello"
   # Watch nvidia-smi in another terminal
   ```

### Permission Issues
If you get permission errors:
```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Logout and login again, or run:
newgrp docker
```

## Performance Comparison

### CPU vs GPU Inference Speed
- **CPU:** ~10-30 tokens/sec (depending on model size)
- **GPU:** ~50-200 tokens/sec (much faster, varies by GPU)

### Memory Usage
- GPU will use VRAM for model weights
- Monitor with: `nvidia-smi`

## Configuration Options

### Limit GPU Memory
In `docker-compose.yml`, you can limit GPU memory:
```yaml
environment:
  - OLLAMA_GPU_MEMORY_FRACTION=0.8  # Use 80% of GPU memory
```

### Use Specific GPU (Multi-GPU Setup)
```yaml
environment:
  - NVIDIA_VISIBLE_DEVICES=0  # Use first GPU only
  # or
  - NVIDIA_VISIBLE_DEVICES=0,1  # Use first two GPUs
```

### Disable GPU (Fallback to CPU)
```bash
# Remove GPU configuration from docker-compose.yml
# Or set:
environment:
  - OLLAMA_GPU=0
```

## Expected Performance Boost
- 3-10x faster inference with GPU
- Ability to run larger models
- Better responsiveness for real-time chat

## Notes
- The 3b model (qwen2.5:3b) will benefit from GPU acceleration
- Larger models (7b, 13b, 70b) require more VRAM
- Check your GPU VRAM with `nvidia-smi` to ensure it can fit the model
