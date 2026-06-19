FROM node:22-alpine as builder
RUN apk add --no-cache openssl
# ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
COPY ./prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

## --- Migrator stage (runs prisma migrate deploy) ---
FROM alpine:3.20 AS migrator
RUN apk add --no-cache nodejs openssl
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /usr/src/app/prisma ./prisma

CMD ["node", "./node_modules/prisma/build/index.js", "migrate", "deploy"]

## --- Runner stage (app only) ---
FROM alpine:3.20 AS runner
RUN apk add --no-cache nodejs openssl
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build .
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

CMD ["node", "index.js"]

