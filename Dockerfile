FROM  node:12.14-slim

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_HOST=dev.smartiys.io
ENV DB_USER=postgres
ENV DB_PASSWORD=1234
ENV DB_NAME=postgres

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --only=production

RUN npm install pm2 -g

COPY ./dist .

EXPOSE 3000

CMD ["pm2-runtime","server.js"]