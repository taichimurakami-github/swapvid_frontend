# SwapVid User Interface Applicaiton

Source Code of "SwapVid: Integrating Video Viewing and Document Exploration (CHI2024 Paper)."

- DOI: **10.1145/3613904.3642515**

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

**[Docker Desktop](https://www.docker.com/ja-jp/products/docker-desktop/) is required.**

### Running as a dev mode

Please run the following command to build the container.

```bash
docker compose up
```

It can take a few minitues. After the following texts shown, you can use the app from http://localhost:3070 .

```bash
swapvid_frontend  |   VITE v4.3.4  ready in 615 ms
swapvid_frontend  |
swapvid_frontend  |   ➜  Local:   http://localhost:3070/
swapvid_frontend  |   ➜  Network: http://XXX.XXX.XXX.XXX:3070/
swapvid_frontend  |   ➜  press h to show help
```

### Building the app

To build the application, you need to

1. Generate assets in the running container
2. Build the application using vite

After running the container (`docker compose up`), and then you can run the following command:

```bash
#Step1: run the container
docker compose up

#Step2: generate the assets
docker compose exec swapvid_ui bash -c "pnpm run generate-pwa-assets"

#Step3: build the app
docker compose exec swapvid_ui bash -c "pnpm build"
```

### Removing the container

Please run the following command:

```bash
docker compose down --rmi "all" --remove-orphans -v
```

## Authors

- **Taichi Murakami** - Tohoku University, Japan
- **Kazuyuki Fujita** - Tohoku University, Japan
- **Kotaro Hara** - Singapore Management University, Singapore
- **Kazuki Takashima** - Tohoku University, Japan
- **Yoshifumi Kitamura** - Tohoku University, Japan

## License

This work is licensed under [a Creative Commons Attribution International 4.0 License](https://creativecommons.org/licenses/by/4.0/).
