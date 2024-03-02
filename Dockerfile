FROM node:20-alpine as deps
WORKDIR /app
COPY package.json package.json
RUN npm install

FROM node:20-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY . .
RUN npm run build

FROM node:20-alpine as thumbnail-microservice
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "dist/microservices/thumbnail/main.js"]

FROM node:20-alpine as nodepop-adv-app
WORKDIR /app
COPY --from=builder /app .
CMD ["npm", "start"]
