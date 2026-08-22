# ---- Stage 1: build the site with Hugo ----
FROM alpine:3.22 AS builder

RUN apk add --no-cache hugo

COPY . /src
WORKDIR /src
RUN hugo --destination /out

# ---- Stage 2: serve with nginx ----
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /out /usr/share/nginx/html

EXPOSE 80
