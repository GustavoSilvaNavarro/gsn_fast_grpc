#!make
PORT = 8080
SERVICE_NAME = tree_api
CONTAINER_NAME = $(SERVICE_NAME)
DOCKER_COMPOSE_TAG = $(SERVICE_NAME)_1

# DB Commands
create-migration:
	npx node-pg-migrate create '$(m)'

apply-migration:
	npx node-pg-migrate up -f ./dbConfig.json

migrate-down:
	npx node-pg-migrate down -f ./dbConfig.json

migrate:
	npm run migration:up

# Pipeline commands
setup:
	npm install

unit:
	npm run test

uncached-unit:
	npm run-script clear-cache; npm run-script test

scan:
	npx better-npm-audit audit --production --level=high

lint:
	npm run lint

lint-fix:
	npm run lint:fix

check:
	npm run check

format:
	npm run format

commitready: format unit integration

prready: scan format uncached-unit integration

check-format: check format

health-check:
	curl --location 'http://localhost:$(PORT)/healthz' --verbose

# External services
run-external-services:
	docker compose -f ./docker-compose.inf.yml up -d db

# Docker commands
build-base:
	@DOCKER_BUILDKIT=1 docker buildx build -f Dockerfile.base -t $(SERVICE_NAME)_base .

up: build-base
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -f ./docker-compose.yml -f ./docker-compose.inf.yml build --parallel
	docker compose -f ./docker-compose.yml -f ./docker-compose.inf.yml up -d --force-recreate --scale integration_tests=0

integration: down-rm up
	docker compose -f ./docker-compose.yml run integration_tests jest -c jest.integration.config.ts ./ -i --forceExit --detectOpenHandles --no-cache

down:
	docker compose -f ./docker-compose.yml -f ./docker-compose.inf.yml down --remove-orphans

down-rm:
	docker compose -f ./docker-compose.yml -f ./docker-compose.inf.yml down --remove-orphans --rmi all --volumes

downup: down up

rebuild:
	docker compose -f ./docker-compose.yml -f ./docker-compose.inf.yml up --build --force-recreate --no-deps $(SERVICE_NAME)

docker-kill-all:
	docker kill $(shell docker ps -q)
