<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<div align='center'>

## pemid.link

</div>

### Steps to run app in development mode
1. Install dependencies
```
npm ci
```
2. Create `.env` file and set environment variables, example of variables needed are in `.env.template` file.
3. Run docker compose file to set up database
```
docker compose up -d
```
4. Run prisma migrations
```
npx prisma migrate dev
```
5. Run application in watch mode
```
npm run start:dev
```