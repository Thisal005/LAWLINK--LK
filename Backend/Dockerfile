FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY patch-pdf-parse.js ./
RUN node patch-pdf-parse.js
COPY gen-lang-client-0493798042-950a63a3aeb7.json ./
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
