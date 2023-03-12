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


  uploadFile(
    bucketName: string,
    filePath: string,
    destFileName: string,
    // file: Express.Multer.File,
    // generationMatchPrecondition = 0
  ) {
    try {
      const upload = async () => {
        const options = {
          destination: destFileName,
        }
        await storage.bucket(bucketName).upload(filePath, options)
        console.log(`${filePath} uploaded to ${bucketName}`)
      }
      upload()
        .then((result) => console.log(result))
        .catch(console.error)
    } 
    catch (error) {
      console.error(error)
    }
  }

  downloadFile(
    bucketName: string,
    fileName: string,
    destFileName: string
  ) {
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

  GCP_PROFILE_BUCKET_NAME= process.env.GCP_PROFILE_BUCKET_NAME
  GCP_POST_BUCKET_NAME = process.env.GCP_POST_BUCKET_NAME
  GCP_EVENT_BUCKET_NAME = process.env.GCP_EVENT_BUCKET_NAME
  GCP_GIG_BUCKET_NAME = process.env.GCP_GIG_BUCKET_NAME
  GCP_WIDGET_BUCKET_NAME = process.env.GCP_WIDGET_BUCKET_NAME

  async uploadProfileImage(filePath: string, id: string) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        this.GCP_PROFILE_BUCKET_NAME,
        filePath,
        destFileName,
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async uploadPostImage(filePath: string, id: string) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        this.GCP_POST_BUCKET_NAME,
        filePath,
        destFileName,
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async uploadEventImage(filePath: string, id: string) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        this.GCP_EVENT_BUCKET_NAME,
        filePath,
        destFileName,
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async uploadGigImage(filePath: string, id: string) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        this.GCP_GIG_BUCKET_NAME,
        filePath,
        destFileName,
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async uploadWidgetImage(filePath: string, id: string) {
    const destFileName = id + '.png'
    try {
      return await this.uploadFile(
        this.GCP_WIDGET_BUCKET_NAME,
        filePath,
        destFileName,
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
}
