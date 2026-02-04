FROM node:18-alpine

WORKDIR /app/frontend

COPY . .

RUN npm ci --legacy-peer-deps

EXPOSE 5173

CMD ["npm", "run", "dev"]
