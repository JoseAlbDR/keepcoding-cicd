import express, { Router } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { envs, i18nAdaper } from '../config';
import fileUpload from 'express-fileupload';

interface Options {
  port: number;
  routes: Router;
  publicPath: string;
  productsImagePath: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly productsImagePath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, publicPath, productsImagePath } = options;

    this.port = port;
    this.routes = routes;
    this.publicPath = publicPath;
    this.productsImagePath = productsImagePath;
  }

  async start() {
    this.app.set('views', path.join(__dirname, 'web', 'views'));
    this.app.set('view engine', 'ejs');

    /**
     * Global Template variables
     */
    this.app.locals.title = 'NodePop';

    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser(envs.JWT_SEED));
    this.app.use(
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
      })
    );
    this.app.use(
      await i18nAdaper.configure({
        locales: ['es', 'en'],
        directory: path.join(__dirname, 'locales'),
        defaultLocale: 'en',
        // autoReload: envs.STAGE !== 'test',
        // syncFiles: true,
        // cookie: 'nodepop-locale',
      })
    );
    // Routes
    this.app.use(this.routes);

    // Public Folder
    this.app.use(express.static(this.publicPath));
    this.app.use(express.static(this.productsImagePath));

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    // this.app.get('*', (req, res) => {
    //   const indexPath = path.join(
    //     __dirname + `../../../${this.publicPath}/index.html`
    //   );
    //   res.sendFile(indexPath);
    // });
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });

    this.serverListener.on('error', (err: NodeJS.ErrnoException) => {
      console.log({ serverError: err });
    });
  }

  public close() {
    return new Promise((resolve, reject) => {
      this.serverListener.close((error: Error | undefined) => {
        if (error) {
          console.log({ error });
          reject('There was an error closing the server');
        } else {
          console.log('Server closed');
          resolve(true);
        }
      });
    });
  }
}
