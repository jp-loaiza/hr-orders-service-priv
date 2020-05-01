FROM node:12
RUN mkdir -p /home/node/service/node_modules && chown -R node:node /home/node/service
WORKDIR /home/node/service
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 8080
CMD [ "node", "server.js" ]
