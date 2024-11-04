FROM node:20-alpine

WORKDIR /test

RUN apk add --no-cache bash

COPY package*.json ./

RUN npm config set strict-ssl false && npm install

COPY . .

CMD ["npm", "test"]

