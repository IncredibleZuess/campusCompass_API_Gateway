FROM node:lts-alpine
WORKDIR /api-gateway
COPY . .
RUN npm install
CMD [ "npm", "run", "dev" ]
EXPOSE 4000