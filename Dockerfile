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
RUN echo "VUE_APP_API_ENDPOINT=http://timfeid.com:8082/\nVUE_APP_SOCKET_URL=http://timfeid.com:3052/" >> .env

RUN yarn build