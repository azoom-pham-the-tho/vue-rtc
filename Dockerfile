FROM node:14-alpine

WORKDIR /vue-rtc

COPY package*.json ./

COPY . .

RUN npm run build

EXPOSE 8080


ENTRYPOINT ["sh", "-c", "yarn && yarn serve"]
