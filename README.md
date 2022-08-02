# QuizVotingSystem
MCS Project with Prof. Zingaro and Ilir

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

### Running the entire app (Docker-Compose)

Coming soon...

### Running the app (Locally/Debugging Purposes)

#### Mongo and Redis Setup

1. Open the `docker-compose.yml` file and comment out all services except `caching` and `mongodb`

2. Running Redis and Mongo

```
docker-compose up --build -d
```

#### Client Setup

1. Setting up the client `.env` file

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

2. Setting up the server `.env` file

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
