FROM node:15.14.0-alpine

WORKDIR /app

ENV PORT=80

RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 80

CMD npm start