

<h1 align="center">
  <p align="center">MCS Poll Voting System</p>
  <p align="center" width="100%"></p>
  <h4 align="center">MCS Project with Prof. Zingaro and Ilir
</h4>
  <p align="center" width="100%">
    <a href="https://poll.utm.utoronto.ca/">poll.utm.utoronto.ca/</a>
  </p>
</h1>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#running-the-app-on-a-server">Running the App (Server)</a> •
  <a href="#running-the-app-locallydebugging-purposes">Running the App (Locally)</a>
</p>

### Installation

1. Install the following requirements

- Yarn >= 2+
- Node 14.17.0
- Latest version of Docker and Docker-Compose


2. Install the dependencies for the client

```
cd client
yarn install
```

3. Install the dependencies for the server

```
cd server
yarn install
```

### Running the app (on a server)
Note: The app installation assumes you already have Shibboleth installed on the server.

1. Setting up the client `.env` file (Placed in the root of your `client` folder)

```
REACT_APP_BACKEND_URL="https://poll.utm.utoronto.ca"
```

2. Setting up the server `.env` file (Placed in the root of your `server` folder)

```
PORT=3001
MONGODB_URL="mongodb://mongodb:27017/quiz"
FRONTEND_URL="https://poll.utm.utoronto.ca"
REDIS_URL="redis://default:password@redis:6379"
WHITELIST=../whitelist
```

3. Add instructor Utorid's to your whitelist file. It should be placed at the root of the `server` folder.

> Your whitelist file should look like the following...

```
utorid1
utorid2
utorid3
...
```

4. Running the entire app

```
docker-compose -up --build -d
```

### Running the app (Locally/Debugging Purposes)

#### Mongo and Redis Setup

1. Open the `docker-compose.yml` file and comment out all services except `caching` and `mongodb`

2. Running Redis and Mongo

```
docker-compose up --build -d
```

#### Client Setup

1. Setting up the client `.env` file (Placed in the root of your `client` folder)

```
REACT_APP_BACKEND_URL="http://localhost:3001"
```

2. Setting up `axios.ts`

> Note: Since we're running poll voting app locally, we'll need to provide some extra information that normally Shibboleth would provide to us.

> Your `axios.ts` file should look like the following:

```
export const instance = axios.create({
  headers: { utorid: "utorid" },
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
});
```

3. Setting up `socket.ts`

> Note: Since we're running poll voting app locally, we'll need to provide some extra information that normally Shibboleth would provide to us.

> Your `socket.ts` file should look like the following:

```
export const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
  withCredentials: true,
  extraHeaders: { utorid: "utorid" }
});
```

4. Running the client

```
yarn run start
```

#### Server Setup 

1. Add instructor Utorid's to your whitelist file. It should be placed at the root of the `server` folder.

> Your whitelist file should look like the following...

```
utorid1
utorid2
utorid3
...
```

2. Setting up the server `.env` file (Placed in the root of your `server` folder)

```
PPORT=3001
MONGODB_URL="mongodb://localhost:27018/quiz"
FRONTEND_URL="http://localhost:3000"
REDIS_URL="redis://default:password@localhost:6379"
WHITELIST=../whitelist
```

3. Running the server

```
yarn run start
```

The client and server will be listening and serving on port `3000` and `3001` respectively.
