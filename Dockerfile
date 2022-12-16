FROM node:16.14.2-alpine3.15
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN yarn install

COPY . /usr/src/bot

CMD ["node", "index.js"]