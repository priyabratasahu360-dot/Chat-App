FROM node:20

WORKDIR /chatapp

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "src/index.js"]