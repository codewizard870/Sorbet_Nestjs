import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Storage } from "@google-cloud/storage";
import * as path from "path";

const cwd = path.join(__dirname, '..');
const storage = new Storage({
  projectId: 'composite-snow-379908',
  keyFilename: '/Users/daenamcclintock/ThriveIN/ThriveIN_Backend/NestJS/composite-snow-379908-80e8442bb816.json'
})
console.log('cwd', cwd)

interface AuthenticationModel {
	keyFile?: string;
	keyFilename?: string;
	autoRetry?: boolean;
	projectId?: string;
	apiEndpoint?: string;
	maxRetries?: number;
	client_id?: string;
	client_secret?: string;
	scope?: string[];
	email?: string;
}

@Injectable()
export class ImagesService {
  constructor(private prismaService: PrismaService) {}
  
  files = []


  uploadFile(
    bucketName: string,
    filePath: string,
    destFileName: string,
    generationMatchPrecondition = 0
  ) {
    try {
      const upload = async () => {
        const options = {
          destination: destFileName,
          preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
        }
        const fileUpload = await storage.bucket(bucketName).upload(filePath, options)
        console.log(`${filePath} uploaded to ${bucketName}`)
        console.log('fileUpload', fileUpload)
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
    destFileName = path.join(cwd, fileName).toString()
    // destFileName = '/Users/daenamcclintock/Desktop'
  ) {
    try {
      const options = {
        destination: destFileName,
      }
      const download = async () => {
        await storage.bucket(bucketName).file(fileName).download(options)
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

  async uploadProfileImage(file: any, id: string) {
    //   const { originalname } = file;
    const filePath = 'src/images/image.png'
    const destFileName = 'image.png'
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

  async uploadPostImage(file: any, id: string) {
    const filePath = ''
    const destFileName = file
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

  async uploadEventImage(file: any, id: string) {
    const filePath = ''
    const destFileName = file
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

  async uploadGigImage(file: any, id: string) {
    const filePath = ''
    const destFileName = file
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

  async uploadWidgetImage(file: any, id: string) {
    const fileName = file
    const destFileName = file
    try {
      return await this.uploadFile(
        this.GCP_WIDGET_BUCKET_NAME,
        fileName,
        destFileName,
      ) 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async downloadProfileImage(name: string, id: string) {
    const fileName = name
    return await this.downloadFile(
      this.GCP_PROFILE_BUCKET_NAME,
      fileName,
    )
  }

  async downloadPostImage(name: string, id: string) {
    const fileName = name
    return await this.downloadFile(
      this.GCP_POST_BUCKET_NAME,
      fileName,
    );
  }

  async downloadGigImage(name: string, id: string) {
    const fileName = name
    return await this.downloadFile(
      this.GCP_GIG_BUCKET_NAME,
      fileName,
    )
  }

  async downloadEventImage(name: string, id: string) {
    const fileName = name
    return await this.downloadFile(
      this.GCP_EVENT_BUCKET_NAME,
      fileName,
    )
  }

  async downloadWidgetImage(name: string, id: string) {
    const fileName = name
    return await this.downloadFile(
      this.GCP_WIDGET_BUCKET_NAME,
      fileName,
    )
  }
}
