FROM node:16-alpine as baseimg

WORKDIR /usr/src/app

RUN apk add --upgrade --no-cache python3 \
  build-base \
  bash linux-headers \
  libuv libuv-dev

# RUN apk add --no-cache \
#   build-base \
#   g++ \
#   cairo-dev \
#   jpeg-dev \
#   pango-dev \
#   giflib-dev

RUN ln -sf python3 /usr/bin/python

RUN yarn global add lerna

# MAKE SURE YOU LOOK AT DOCKERIGNORE IF YOU ARE CONFUSED
COPY . .

RUN lerna bootstrap
WORKDIR /usr/src/app/packages/ui
RUN echo "VUE_APP_API_ENDPOINT=https://wolf.timfeid.com/api/" >> .env
RUN echo "VUE_APP_SOCKET_URL=https://socket.timfeid.com/" >> .env

RUN yarn build