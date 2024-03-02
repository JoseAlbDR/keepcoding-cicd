import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';

export class FileUploadMiddleware {
  static containFiles({
    required = true,
    varName = 'file',
  }: { required?: boolean; varName?: string } = {}) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (required && (!req.files || Object.keys(req.files).length === 0))
        return res.status(400).json({ error: 'No files found.' });

      if (req.files) {
        if (!Array.isArray(req.files[varName]))
          req.body.files = [req.files[varName]];

        if (Array.isArray(req.files[varName]))
          req.body.files = req.files[varName];
      }

      next();
    };
  }

  static validateType(validTypes: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const type = req.url.split('/').at(-1) ?? '';

      if (!validTypes.includes(type))
        return res.status(400).json({
          error: `Invalid type: ${type}, valid values: ${validTypes.join(
            ', '
          )}`,
        });
      next();
    };
  }

  static validateExtension(validExtensions: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const files = req.body.files as UploadedFile[];

      files.forEach((file) => {
        const fileExtension = file.mimetype.split('/').at(-1) ?? '';

        if (!validExtensions.includes(fileExtension))
          return res.status(400).json({
            error: `Invalid extension: ${fileExtension}, valid values: ${validExtensions.join(
              ', '
            )}`,
          });
      });
      next();
    };
  }
}
