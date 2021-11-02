FROM node:16
RUN mkdir /api
COPY . /api
WORKDIR /api
RUN yarn install
RUN yarn build
CMD ["node", "dist/server.js"]

