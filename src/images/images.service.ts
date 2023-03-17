import { Injectable, Redirect } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Storage } from "@google-cloud/storage";
import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as path from "path";

@Injectable()
export class ImagesService {
  constructor() {}

  storage = new Storage({
    keyFilename: path.join(__dirname, '../../aerobic-badge-379110-bcaae1f06e2b.json'),
    projectId: 'aerobic-badge-379110',
  })

  // vision = new ImageAnnotatorClient({})
  
  uploadFile = async (file: Express.Multer.File, bucketName: string, userId: string) => {
    const bucket = this.storage.bucket(bucketName)
    const gcsFileName = `${userId}.png`
    const options = {
      metadata: {
        contentType: 'image/png',
      },
    }

    const stream = bucket.file(gcsFileName).createWriteStream(options)
    stream.on('error', (err) => {
      console.error(err);
    })
    stream.on('finish', async () => {
      await bucket.file(gcsFileName).makePublic()
    });

    stream.end(file.buffer);

    const imageUrl = await new Promise<string>((resolve, reject) => {
      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`
        resolve(publicUrl)
      })

      stream.on('error', (err) => {
        reject(err)
      })
    })

    return { imageUrl }
  }

  getFileMetadata = async (bucketName: string, fileName: string) => {
    try {
      const bucket = this.storage.bucket(bucketName)
      const file = bucket.file(fileName)
      const getMetadata = async () => {
        const [ metadata ] = await file.getMetadata()
        return metadata
        // if (metadata.contentType.startsWith('image/')) {
        //   const [imageBuffer] = await file.download();
        //   const [result] = await this.vision.annotateImage({
        //     image: { content: imageBuffer },
        //     features: [{ type: 'IMAGE_PROPERTIES' }],
        //   });
        //   console.log('imagePropertiesAnnotation', result.imagePropertiesAnnotation);
        // }
      }
      getMetadata()
        .then((result) => {
          if (result.bucket == bucketName && result.name == fileName) {
            console.log(result)
            return result
          }
        })
        .catch(console.error)
    } 
    catch (error) {
      console.error(error)
    }
  }

  downloadFile = async (bucketName: string, userId: string, destFileName: string) => {
    try {
      const options = {
        destination: destFileName,
      }
      const download = async () => {
        await this.storage.bucket(bucketName).file(userId + '.png').download(options);
    
        console.log(
          `gs://${bucketName}/${userId + '.png'} downloaded to ${destFileName}.`
        )
      }
  
      download()
        .then((result) => console.log(result))
        .catch(console.error)
    } 
    catch (error) {
      console.error(error)
    }
  }

  deleteFile = async (bucketName: string, fileName: string) => {
    try {
      const deleteFile = async () => {
        const bucket = await this.storage.bucket(bucketName)
        const file = bucket.file(fileName)
        await file.delete()
    
        console.log(`gs://${bucketName}/${fileName} deleted`)
        return { message: `Successfully deleted file: ${fileName} from bucket: ${bucketName}` }
      }
      deleteFile()
        .then(result => console.log('deletedFile', result))
        .catch(error => console.error(error))
    } 
    catch (error) {
      console.error(error)
    }
  }

  async uploadImage(file: Express.Multer.File, bucketName: string, id: string) {
    try {
      return await this.uploadFile(
        file,
        bucketName,
        id
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async getImageMetadata(bucketName: string, id: string) {
    const fileName = id + '.png'
    return await this.getFileMetadata(
      bucketName,
      fileName
    )
  }

  async downloadImage(bucketName: string, id: string, destFileName: string) {
    const fileName = id + '.png'
    return await this.downloadFile(
      bucketName,
      fileName,
      destFileName
    )
  }

  async deleteImage(bucketName: string, id: string) {
    const fileName = id + '.png'
    return await this.deleteFile(
      bucketName,
      fileName
    )
  }
}
