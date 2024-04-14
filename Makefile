init:
	docker compose up --build

run:
	docker compose up

remove:
	docker compose down --rmi "all" --remove-orphans -v

generate-assets:
	docker compose exec swapvid_ui bash -c "pnpm run generate-pwa-assets"

build: generate-assets
	docker compose exec swapvid_ui bash -c "pnpm build"