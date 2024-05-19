# Gateway Service
This service is responsible for managing authentication and authorization for the service.

## Endpoints
- `GET /` - Returns .

## Configuration
- `PORT` - Port on which the service will run. Default is `4002`.

## Running the service
- Run `npm install` to install all dependencies.
- Run `npm run dev` to start the service.
- The service will be available at `http://localhost:4002`.
```
.
├── Dockerfile
├── README.md
├── jest.config.ts
├── package-lock.json
├── package.json
├── prettierrc.json
├── src
│   ├── app.ts
│   ├── config.ts
│   ├── database.ts
│   ├── elasticsearch.ts
│   ├── models
│   │   └── auth.schema.ts
│   ├── routes.ts
│   ├── schemes
│   │   ├── password.ts
│   │   ├── signin.ts
│   │   └── signup.ts
│   └── server.ts
└── tsconfig.json