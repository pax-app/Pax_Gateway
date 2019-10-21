FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm ci --only=production

COPY . .

EXPOSE 3002
CMD [ "npm", "start"]
