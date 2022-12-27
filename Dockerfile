# We're using a multi stage build to avoid huge images containing the whole src folder
FROM node:16.15-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16.15-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
#Installs unix-dgram which is required for hot-shots client
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm set-script prepare '' && npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/version.txt ./

EXPOSE 8080
CMD [ "node", "dist/server.js" ]
