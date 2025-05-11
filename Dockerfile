FROM node:21

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads

EXPOSE 4000
CMD ["node", "server.js"]