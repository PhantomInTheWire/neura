# Dockerfile
FROM node:22.12.0-alpine3.21

# RUN addgroup app && adduser -S -G app app
# USER app

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . ./

# ENV API_URL=https://api.myapp.com/
EXPOSE 3000

CMD ["npm", "run", "dev"]