FROM node:14

WORKDIR /usr/src/app

RUN npm i

RUN npm start

EXPOSE 3001

CMD ["npm", "run", "start"]