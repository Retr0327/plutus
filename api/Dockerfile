FROM node:22-alpine AS base

# ---

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

# ---

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN corepack enable

RUN pnpm run build

# ---

FROM base AS runner

WORKDIR /app

RUN apk add --no-cache bind-tools procps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm

ENV NODE_ENV=prod

RUN addgroup --system --gid 1001 nodejs

RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nestjs:nodejs /app/libs ./libs
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

