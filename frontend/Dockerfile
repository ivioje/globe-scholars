FROM node:20.19

WORKDIR /app

COPY globe-scholars/package*.json ./
RUN npm install

COPY globe-scholars/ .

CMD ["npm", "start", "--", "--host", "0.0.0.0"]