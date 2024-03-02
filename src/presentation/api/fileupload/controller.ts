import { Request, Response } from 'express';
import { ErrorHandler } from '../../../domain';
import { FileUploadService } from '../services/file-upload.service';
import { UploadedFile } from 'express-fileupload';

export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly errorHandler: ErrorHandler
  ) {}

  uploadSingleFile = (req: Request, res: Response) => {
    const { destiny } = req.params;
    const file = req.body.files.at(0) as UploadedFile;

    this.fileUploadService
      .uploadSingle(file, destiny)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.errorHandler.handleError(error, res));
  };

  uploadMultipleFiles = (req: Request, res: Response) => {
    const { destiny } = req.params;
    const files = req.body.files as UploadedFile[];

    this.fileUploadService
      .uploadMultiple(files, destiny)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => this.errorHandler.handleError(error, res));
  };
}
