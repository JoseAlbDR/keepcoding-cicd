import { Responder, Event } from 'cote';
import { ThumbnailMicroservice } from './thumbnail.microservice';

interface ThumbnailPayload extends Event {
  imagePath: string;
  imageName: string;
  imageExtension: string;
}

(async () => {
  await main();
})();

async function main() {
  const responder = new Responder({
    name: 'Thumbnail microservice Responder',
  });

  responder.on('generate-thumbnail', async (req, done) => {
    const { imagePath, imageName, imageExtension } = req as ThumbnailPayload;

    try {
      const result = await ThumbnailMicroservice.resizeImage({
        imagePath,
        imageName,
        imageExtension,
      });

      done(null, result);
    } catch (error) {
      done(error, null);
    }
  });
}
