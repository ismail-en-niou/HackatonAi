# Makefile to manage Docker Compose services

# Start all services in detached mode
up:
	mkdir -p /tmp/app/data
	docker compose up -d

# Stop and remove all services
down:
	docker compose down

# Rebuild images without cache
build:
	docker compose build --no-cache

# Restart all services
restart:
	docker compose down
	mkdir -p /tmp/app/data
	docker compose up -d

# View logs (follow mode)
logs:
	docker compose logs -f

# Show service status
ps:
	docker compose ps

# Clean unused images, volumes, containers
prune:
	docker system prune -af --volumes
