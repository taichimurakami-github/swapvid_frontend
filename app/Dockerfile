FROM node:20-slim AS base


ENV TZ Asia/Tokyo
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


COPY ./app /app
WORKDIR /app


RUN pnpm i