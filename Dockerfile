FROM node:14

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN yarn

RUN yarn run start-linux

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start-linux", "yarn"]