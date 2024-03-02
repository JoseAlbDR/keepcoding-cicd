import { Requester } from 'cote';
import { CustomError } from '../domain';

interface RequestOptions {
  name: string;
  type: string;
  [key: string]: any;
}

export class CoteAdapter {
  async request(options: RequestOptions) {
    return new Promise((resolve, reject) => {
      const { name, type, ...payload } = options;

      const requester = new Requester({ name });

      const event = {
        type,
        ...payload,
      };

      requester.send(event, (err, result) => {
        if (err) {
          // console.error('There was an error:', err);
          reject(CustomError.internalServer(String(err)));
        } else {
          resolve(result);
        }
      });
    });
  }
}
