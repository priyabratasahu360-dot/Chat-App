FROM node:20

WORKDIR /chatapp

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]