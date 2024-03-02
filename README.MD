# NODEPOP-ADV

## INSTALLATION

0.1.- **Optionally**
Run a mongo db docker container with the following command, all .env.templates are ready to work with this db
```bash
  docker run --name nodepop-db -d -p 27017:27017 mongo:6.0.6
```

### VIA GIT

### Development

1.- **Clone the project and move to the folder**

```bash
  git clone https://github.com/JoseAlbDR/practica-node-avanzado.git
  cd practica-node-avanzado
```

2.- **Install the project dependencies**

```bash
  npm i
```

3.- **Copy .env.template and rename it to .env, fill the needed environment variables with yours, set STAGE to development**

```js
  # Default Settings

  STAGE=development

  PORT=3000

  MONGO_URL=mongodb://localhost:27017
  MONGO_DB_NAME=nodepop-adv

  JWT_SEED=youSecretKey

  PUBLIC_FOLDER=public
  UPLOADS_FOLDER=uploads
```

4.- **Run the project in development mode**

```bash
  npm run dev
```

5.- **Populate database**

```bash
  npm run seed
```

6.- **Run the Thumbnail Microservice**

```bash
  npm run thumbnail-service
```

### Production

1.- **Clone the project and move to the folder**

```bash
  git clone https://github.com/JoseAlbDR/practica-node-avanzado.git
  cd practica-node-avanzado
```

2.- **Install the project dependencies**

```bash
  npm i
```

3.- **Copy .env.template and rename it to .env, fill the needed environment variables with yours, set STAGE to production**

```js
  # Default Settings

  STAGE=production

  PORT=3000

  MONGO_URL=mongodb://localhost:27017
  MONGO_DB_NAME=nodepop-adv

  JWT_SEED=youSecretKey

  PUBLIC_FOLDER=public
  UPLOADS_FOLDER=uploads
```

4.- **Run build command**

```bash
  npm run build
```

5.- **Run start command**

```bash
  npm start
```

6.- **Populate database**

```bash
  npm run prod-seed
```

7.- **Run the Thumbnail Microservice**

```bash
  npm run prod-thumbnail
```

## TESTING

1.- **Testing uses .env.test environment file, fill it as your needs**

Test are done with jest and supertest, testing all the api endpoints.

**NOTE**: This initializes a new server and empty database

Example .env.test environment file

```js
  PORT=3001

  MONGO_URL=mongodb://localhost:27017/test-db
  MONGO_DB_NAME=nodepop-adv-test

  JWT_SEED=milittlesecret

  PUBLIC_FOLDER=public
  UPLOADS_FOLDER=uploads
```

Run:

```bash
  npm test
```


## FEATURES

### Authentication

Nodepop-adv uses bcrypt to hash and secure passwords and JWT for authentication. Upon signing up, user data is stored in the database with the hashed password. The login endpoint handles password validation and sends back a token in a cookie. The Auth middleware authenticates by validating the received token in the cookie and sets a new property in the body called 'user' with the payload from the token.

### Internationalization

Nodepop-adv uses the i18n library to internationalize the application. Accessing [http://localhost:${PORT}](http://localhost:${PORT}) will display a frontend page showing the current products in the database. On this page, two flags are visible—one for Spanish language and one for English language. By clicking on them, users can switch the language of the page.

### Image Upload with Thumbnail Background Task

Nodepop-adv utilizes express-fileupload to handle the upload of product images. When an image is uploaded, it is stored in `${PUBLIC_FOLDER}/${UPLOADS_FOLDER}/products` (default: public/uploads/products). The uploaded image name is generated based on the original name plus a unique identifier.

A thumbnail is generated during the image upload process using Cote for the microservice and jimp to build the thumbnail. Within the FileUploadService, an event called 'generate-thumbnail' is triggered, and the ThumbnailMicroservice listens for this event to generate the thumbnail.
