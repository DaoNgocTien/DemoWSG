FROM node:14

RUN /bin/sh -c npm i

RUN /bin/sh -c npm start

EXPOSE 3001

CMD ["npm", "run", "start"]