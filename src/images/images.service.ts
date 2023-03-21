import { Injectable } from "@nestjs/common";
import { Storage as GCPStorage } from '@google-cloud/storage';
import path from "path";


@Injectable()
export class ImagesService {
  constructor() {}

  secretContent = process.env['aerobic-badge-379110-bcaae1f06e2b']
  localPath = path.join(__dirname, '../../aerobic-badge-379110-bcaae1f06e2b.json')

  // keyFilename = process.env.NODE_ENV === 'production' ? this.secretContent : this.localPath
  keyFilename = this.secretContent

  storage = new GCPStorage({
    keyFilename: this.keyFilename,
    projectId: 'aerobic-badge-379110',
  })
  
  uploadFile = async (file: Express.Multer.File, bucketName: string, userId: string) => {
    const storage = this.storage
    const bucket = storage.bucket(bucketName)
    const gcsFileName = `${userId}.png`
    const options = {
      metadata: {
        contentType: 'image/png',
      },
    }

    const stream = bucket.file(gcsFileName).createWriteStream(options)
    stream.on('error', (error) => {
      console.error(error)
    })

    stream.on('finish', async () => {
      await bucket.file(gcsFileName).makePublic()
    })

    stream.end(file.buffer)

    const imageUrl = await new Promise<string>((resolve, reject) => {
      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`
        resolve(publicUrl)
      })

      stream.on('error', (error) => {
        reject(error)
      })
    })

    return { imageUrl }
  }

  getFileMetadata = async (bucketName: string, userId: string) => {
    try {
      const bucket = this.storage.bucket(bucketName)
      const gcsFileName = `${userId}.png`

      const file = bucket.file(gcsFileName)
      const [metadata] = await file.getMetadata()

      return metadata
    }
    catch (error) {
      console.error(error)
    }
  }

  downloadFile = async (bucketName: string, userId: string) => {
    try {
      const bucket = this.storage.bucket(bucketName)
      const gcsFileName = `${userId}.png`

      const file = bucket.file(gcsFileName)
      const stream = file.createReadStream()

      stream.on('error', (err) => {
        console.error(err);
        throw new Error('File not found')
      })

      stream.on('response', (response) => {
        response.headers['Content-Type'] = 'image/png';
        response.headers['Content-Disposition'] = `attachment; filename="${gcsFileName}"`
      })

      return stream
    }
    catch (error) {
      console.error(error)
    }
  }

  deleteFile = async (bucketName: string, userId: string) => {
    try {
        const fileName = userId + '.png'
        const bucket = await this.storage.bucket(bucketName)
        const file = bucket.file(fileName)
        await file.delete()

        console.log(`gs://${bucketName}/${fileName} deleted`)
        return { message: `Successfully deleted file: ${fileName} from bucket: ${bucketName}` }
    }
    catch (error) {
      console.error(error)
    }
  }

  async uploadImage(file: Express.Multer.File, bucketName: string, userId: string) {
    try {
      return await this.uploadFile(
        file,
        bucketName,
        userId
      )
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async getImageMetadata(bucketName: string, userId: string) {
    return await this.getFileMetadata(
      bucketName,
      userId
    )
  }

  async downloadImage(bucketName: string, userId: string) {
    return await this.downloadFile(
      bucketName,
      userId
    )
  }

  async deleteImage(bucketName: string, userId: string) {
    return await this.deleteFile(
      bucketName,
      userId
    )
  }
}
