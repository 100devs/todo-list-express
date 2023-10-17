FROM node:lts

WORKDIR /server

COPY package.json /server
COPY package-lock.json /server

RUN npm ci

COPY . /server

EXPOSE 3000

ARG DB_STRING

CMD [ "npm", "start" ]
