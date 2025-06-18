FROM node:lts-alpine
WORKDIR /project
COPY package*.json ./
RUN npm i --production

COPY . .

EXPOSE 3001
CMD ["npm", "run", "dev"]