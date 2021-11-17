FROM node:16
RUN mkdir /frontend
COPY . /frontend
WORKDIR /frontend
RUN yarn install
RUN yarn build
RUN yarn global add serve
CMD ["serve", "-l", "3001", "-s", "build"]

