generate-assets:
	@echo "Starting asset generation process..."
	pnpm run generate-pwa-assets

build: generate-assets
	@echo "Starting build process..."
	pnpm build


deploy: build
	@echo "Starting deploy process..."
	firebase deploy --only hosting

