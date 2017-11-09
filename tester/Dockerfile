FROM node:9.1.0

WORKDIR /test

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY index.js index.js
COPY test.proto test.proto

CMD node index.js
