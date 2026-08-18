FROM node:22

WORKDIR /app

ENV HUSKY=0
ENV CI=true

COPY package.json pnpm-lock.yaml ./

RUN corepack enable

ENV PNPM_ALLOW_BUILDS=msw,sharp

RUN pnpm install --ignore-scripts --frozen-lockfile 

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]