init:
	docker compose up --build

run:
	docker compose up

remove:
	docker compose down --rmi "all" --remove-orphans -v