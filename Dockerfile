FROM node:alpine as builder

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
COPY tools ./tools
RUN npm ci && npm run build

FROM node:alpine

WORKDIR /app
RUN apk add --no-cache curl
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
RUN npm install -g pm2
RUN npm ci --only=production
COPY --from=builder /app/build ./build

EXPOSE 4002
CMD ["npm", "run", "start"]