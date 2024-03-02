import jimp from 'jimp';
import { envs } from '../../config';
import path from 'path';

interface ResizeImageOptions {
  imagePath: string;
  imageExtension: string;
  imageName: string;
}

export class ThumbnailMicroservice {
  static async resizeImage(options: ResizeImageOptions) {
    const { imagePath, imageExtension, imageName } = options;

    const absolutePath = path.join(imagePath, `${imageName}.${imageExtension}`);

    try {
      const image = await jimp.read(absolutePath);

      await image.resize(100, jimp.AUTO);

      const thumbPath = path.join(
        envs.UPLOADS_FOLDER,
        'products',
        'thumbnails',
        `${imageName}-thumb.${imageExtension}`
      );

      await image.writeAsync(thumbPath);

      return 'Thumbnail created';
    } catch (error) {
      throw String(error);
    }
  }
}
