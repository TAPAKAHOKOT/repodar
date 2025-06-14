# Docker compose команды
up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

test:
	docker compose --profile service run --rm backend-service python manage.py test --verbosity 2
