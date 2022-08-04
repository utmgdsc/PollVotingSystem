FROM node:16
ARG REACT_APP_BACKEND_URL
RUN mkdir /frontend
COPY . /frontend
WORKDIR /frontend
RUN echo "REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}" > .env
RUN yarn install --ignore-scripts --frozen-lockfile
RUN yarn build
RUN yarn global add serve
CMD ["serve", "-l", "3001", "-s", "build"]

