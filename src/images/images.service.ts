import { Injectable, Redirect } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Storage } from "@google-cloud/storage";
import * as path from "path";

const cwd = path.join(__dirname, '..');
const storage = new Storage({
  keyFilename: path.join(__dirname, '../../aerobic-badge-379110-bcaae1f06e2b.json'),
  projectId: 'aerobic-badge-379110',
})

@Injectable()
export class ImagesService {
  constructor() {}
  
  files = []

  uploadFile = (bucketName: string, file: Express.Multer.File) => new Promise( async (resolve, reject) => {
    const bucket = await storage.bucket(bucketName)
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
    .on('error', () => {
      reject(`Unable to upload image.`)
    })
    .end(buffer)
  })

  downloadFile(bucketName: string, fileName: string, destFileName: string) {
    try {
      const bucket = storage.bucket(bucketName)
      const options = {
        destination: destFileName,
      }
      const download = async () => {
        await storage.bucket(bucketName).file(fileName).download(options);
    
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

  deleteFile(
    bucketName: string,
    fileName: string,
    generationMatchPrecondition = 0
  ) {
    try {
      const deleteOptions = {
        ifGenerationMatch: generationMatchPrecondition,
      };
      async function deleteFile() {
        await storage.bucket(bucketName).file(fileName).delete(deleteOptions)
    
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

  GCP_PROFILE_BUCKET_NAME= process.env.GCP_PROFILE_BUCKET_NAME
  GCP_POST_BUCKET_NAME = process.env.GCP_POST_BUCKET_NAME
  GCP_EVENT_BUCKET_NAME = process.env.GCP_EVENT_BUCKET_NAME
  GCP_GIG_BUCKET_NAME = process.env.GCP_GIG_BUCKET_NAME
  GCP_WIDGET_BUCKET_NAME = process.env.GCP_WIDGET_BUCKET_NAME

  async uploadProfileImage(id: string, file: Express.Multer.File) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        this.GCP_PROFILE_BUCKET_NAME,
        file,
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async uploadPostImage(id: string, file: Express.Multer.File) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        this.GCP_POST_BUCKET_NAME,
        file,
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async uploadEventImage(id: string, file: Express.Multer.File) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        this.GCP_EVENT_BUCKET_NAME,
        file
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async uploadGigImage(id: string, file: Express.Multer.File) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        this.GCP_GIG_BUCKET_NAME,
        file
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async uploadWidgetImage(id: string, file: Express.Multer.File) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        this.GCP_WIDGET_BUCKET_NAME,
        file
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async downloadProfileImage(id: string, destFileName: string) {
    const fileName = id + '.png'
    return await this.downloadFile(
      this.GCP_PROFILE_BUCKET_NAME,
      fileName,
      destFileName
    )
  }

  async downloadPostImage(id: string, destFileName: string) {
    const fileName = id + '.png'
    return await this.downloadFile(
      this.GCP_POST_BUCKET_NAME,
      fileName,
      destFileName
    );
  }

  async downloadGigImage(id: string, destFileName: string) {
    const fileName = id + '.png'
    return await this.downloadFile(
      this.GCP_GIG_BUCKET_NAME,
      fileName,
      destFileName
    )
  }

  async downloadEventImage(id: string, destFileName: string) {
    const fileName = id + '.png'
    return await this.downloadFile(
      this.GCP_EVENT_BUCKET_NAME,
      fileName,
      destFileName
    )
  }

  async downloadWidgetImage(id: string, destFileName: string) {
    const fileName = id + '.png'
    return await this.downloadFile(
      this.GCP_WIDGET_BUCKET_NAME,
      fileName,
      destFileName
    )
  }

  async deleteProfileImage(id: string) {
    const fileName = id + '.png'
    return await this.deleteFile(
      this.GCP_PROFILE_BUCKET_NAME,
      fileName
    )
  }

  async deletePostImage(id: string) {
    const fileName = id + '.png'
    return await this.deleteFile(
      this.GCP_POST_BUCKET_NAME,
      fileName
    )
  }

  async deleteGigImage(id: string) {
    const fileName = id + '.png'
    return await this.deleteFile(
      this.GCP_GIG_BUCKET_NAME,
      fileName
    )
  }

  async deleteEventImage(id: string) {
    const fileName = id + '.png'
    return await this.deleteFile(
      this.GCP_EVENT_BUCKET_NAME,
      fileName
    )
  }

  async deleteWidgetImage(id: string) {
    const fileName = id + '.png'
    return await this.deleteFile(
      this.GCP_WIDGET_BUCKET_NAME,
      fileName
    )
  }
}
