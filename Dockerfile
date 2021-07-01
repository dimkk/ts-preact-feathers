FROM node:12.18.3-alpine3.12

WORKDIR /app-starter
COPY . .
RUN npm i \
    && npm run build

CMD ["npm", "run", "start:back"]
