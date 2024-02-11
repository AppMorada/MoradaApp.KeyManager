FROM node:latest AS base

RUN mkdir -p /usr/node/app
WORKDIR /usr/node/app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY functions ./functions
COPY package.json .
COPY pnpm-lock.yaml .

#---------- prod deps ------------
FROM base AS prod_deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

#--------- build stage -----------
FROM base AS builder

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY tsconfig.json .
COPY .swcrc.json .

RUN pnpm run build

#------- release stage -----------
FROM base

COPY --from=prod_deps /usr/node/app/node_modules ./node_modules
COPY --from=builder /usr/node/app/dist ./dist
COPY ./tools/ ./tools

VOLUME ["/usr/node/app/node_modules"]
