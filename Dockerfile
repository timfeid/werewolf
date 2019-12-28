FROM node:13-alpine as baseimg

WORKDIR /usr/src/app

RUN apk add --upgrade --no-cache python \
  build-base \
  bash linux-headers \
  libuv libuv-dev

RUN yarn global add lerna

# MAKE SURE YOU LOOK AT DOCKERIGNORE IF YOU ARE CONFUSED
COPY . .

RUN lerna bootstrap

