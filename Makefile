

asset-generate:
	@echo "Starting asset generation process..."
	pnpm run generate-pwa-assets

build: asset-generate
	@echo "Starting build process..."
	pnpm build


deploy: build
	@echo "Starting deploy process..."
	firebase deploy --only hosting

