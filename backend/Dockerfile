FROM node:22-alpine

WORKDIR /app


COPY package*.json ./

RUN npm install

RUN npm install -g pm2

COPY . .


EXPOSE  8080

ENTRYPOINT ["sh", "-c", "sleep 10 && exec pm2-runtime start src/server.js --name backend-leaderboard"]
