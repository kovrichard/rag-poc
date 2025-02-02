.PHONY: build dev start stop restart sh db migrate

build:
	docker compose build

dev:
	docker compose up

start:
	docker compose up -d

stop:
	docker compose down

restart: stop start

sh:
	docker compose exec server bash

db:
	docker compose exec db psql -U dev_user -d dev_db

migrate:
	docker compose exec server bun run migrate --skip-generate
