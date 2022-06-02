FROM node:14

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm i

RUN npm start

EXPOSE 3001

CMD ["npm", "run", "start"]