FROM node:alpine

WORKDIR /app
COPY PACKAGE.json .
RUN npm install
COPY . .

CMD("npm","start")

