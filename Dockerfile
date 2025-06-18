FROM node:lts-alpine
WORKDIR /project
COPY package*.json ./
RUN npm i --production

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]