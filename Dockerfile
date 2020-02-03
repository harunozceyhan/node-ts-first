FROM  node:12.14-slim

WORKDIR /usr/src/app

RUN npm install pm2 -g

COPY package.json ./

COPY ./node_modules .

COPY ./dist .

EXPOSE 3000

CMD ["pm2-runtime","server.js"]