FROM node:21
RUN mkdir /app
WORKDIR /app 
COPY . /app
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
