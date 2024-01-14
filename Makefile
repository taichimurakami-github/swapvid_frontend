
build:
	@echo "Starting build process..."
	pnpm build


deploy: build
	@echo "Starting deploy process..."
	firebase deploy --only hosting

