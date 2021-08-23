FROM node:16.6.2-alpine3.13

RUN mkdir /app
WORKDIR /app/

COPY package.json package-lock.json ./
RUN npm i

COPY . /app/

RUN node ace build --production --client npm --ignore-ts-errors &&  \
  mv build /build && \ 
  mv node_modules /build/node_modules && \
  mv fixtures /build/fixtures && \ 
  mv resources /build/resources && \ 
  mv CHECKS /build/CHECKS && \
  mv web.sh /build/web.sh && \
  mv release.sh /build/release.sh && \
  mv Procfile /build/Procfile

WORKDIR /build
RUN rm -rf /app

RUN addgroup -S kulturdaten-berlin && adduser -S api -G kulturdaten-berlin
RUN chown -R api:kulturdaten-berlin /build
USER api