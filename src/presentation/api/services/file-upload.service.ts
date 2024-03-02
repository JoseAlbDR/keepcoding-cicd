import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { CoteAdapter, FsAdapter, Uuid } from '../../../config';

export class FileUploadService {
  private destination: string = '';

  constructor(
    private readonly uuid = Uuid.v4(),
    private readonly coteAdapter = new CoteAdapter()
  ) {}

  private makeFolder(folderPath: string) {
    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath, { recursive: true });
  }

  private deleteFolder(folderPath: string) {
    if (fs.existsSync(folderPath)) FsAdapter.rmdir(folderPath);
  }

  public async uploadSingle(file: UploadedFile, folder: string = 'images') {
    if (!file) return { filename: '' };

    try {
      this.destination = path.resolve(__dirname, '../../../../uploads', folder);

      this.makeFolder(this.destination);

      const [name, extension] = file.name.split('.') ?? '';

      const fileName = `${this.uuid}-${name}.${extension}`;

      file.mv(`${this.destination}/${fileName}`);

      await this.coteAdapter.request({
        name: 'Thumbnail microservice Requester',
        type: 'generate-thumbnail',
        imagePath: this.destination,
        imageExtension: extension,
        imageName: fileName.split('.').at(0),
      });

      return { fileName };
    } catch (err) {
      console.log({ err });
      this.deleteFolder(this.destination);
      throw err;
    }
  }

  public async uploadMultiple(
    files: UploadedFile[],
    folder: string = 'images'
  ) {
    const fileNames = await Promise.all(
      files.map((file) => this.uploadSingle(file, folder))
    );

    return fileNames;
  }
}
