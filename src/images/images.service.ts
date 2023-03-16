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
  
  uploadFile = (bucketName: string, file: Express.Multer.File) => new Promise( async (resolve, reject) => {
    const bucket = await this.storage.bucket(bucketName)
    const { originalname, buffer } = file
  
    const blob = bucket.file(originalname.replace(/ /g, "_"))
    const blobStream = blob.createWriteStream({
      resumable: false,
      public: true
    })
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      resolve(publicUrl)
    })
    .on('error', (e) => {
      console.log(e)
      reject(`Unable to upload image.`)
    })
    .end(buffer)
  })

  getFileMetadata(bucketName: string, fileName: string) {
    try {
      const bucket = this.storage.bucket(bucketName);
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

  downloadFile(bucketName: string, fileName: string, destFileName: string) {
    try {
      const bucket = this.storage.bucket(bucketName)
      console.log('bucket', bucket)
      const options = {
        destination: destFileName,
      }
      const download = async () => {
        await this.storage.bucket(bucketName).file(fileName).download(options);
    
        console.log(
          `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
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

  deleteFile(bucketName: string, fileName: string, generationMatchPrecondition = 0) {
    try {
      const deleteOptions = {
        ifGenerationMatch: generationMatchPrecondition,
      };
      async function deleteFile() {
        await this.storage.bucket(bucketName).file(fileName).delete(deleteOptions)
    
        console.log(`gs://${bucketName}/${fileName} deleted`)
      }
      deleteFile()
        .then(result => console.log('deletedFile', result))
        .catch(error => console.error(error))
    } 
    catch (error) {
      console.error(error)
    }
  }

  async uploadImage(bucketName: string, id: string, file: Express.Multer.File) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        bucketName,
        file,
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
