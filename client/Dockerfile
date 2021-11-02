FROM node:16
ENV HOST 0.0.0.0
RUN mkdir /frontend
COPY . /frontend
WORKDIR /frontend
RUN yarn install
RUN yarn build
RUN yarn global add serve
CMD ["serve", "-s", "build"]

