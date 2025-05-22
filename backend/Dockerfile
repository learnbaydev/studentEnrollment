FROM node:21
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm i axios
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start"]

