import { Injectable } from "@nestjs/common";
import { StorageClass } from 'src/utils/gcp/storage';
import { Storage as GCPStorage } from '@google-cloud/storage';


@Injectable()
export class ImagesService {
  storageInstance: StorageClass | null = null;

  constructor() {
    StorageClass.createInstance().then((instance) => {
      this.storageInstance = instance;
    })
      .catch((error) => {
        console.error(error)
      })
  }
  uploadFile = async (file: Express.Multer.File, bucketName: string, userId: string) => {
    console.log('file', file)
    console.log('bucketName', bucketName)
    console.log('userId', userId)
    const storage = this.storageInstance.storage;
    const bucket = storage.bucket(bucketName);
    // const bucket = this.storageInstance.storage.bucket(bucketName)
    console.log('storage', storage)
    console.log('bucket', bucket)
    const gcsFileName = `${userId}.png`
    const options = {
      metadata: {
        contentType: 'image/png',
      },
    }

    const stream = bucket.file(gcsFileName).createWriteStream(options)
    console.log('stream', stream)
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
      console.log('bucketName', bucketName)
      console.log('userId', userId)
      const bucket = this.storageInstance.storage.bucket(bucketName)
      console.log('bucket', bucket)
      const gcsFileName = `${userId}.png`

      const file = bucket.file(gcsFileName)
      console.log('file', file)
      const [metadata] = await file.getMetadata()
      console.log('metadata', metadata)

      return metadata
    }
    catch (error) {
      console.error(error)
    }
  }

  downloadFile = async (bucketName: string, userId: string) => {
    try {
      console.log('bucketName', bucketName)
      console.log('userId', userId)
      const bucket = this.storageInstance.storage.bucket(bucketName)
      console.log('bucket', bucket)
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
      console.log('bucketName', bucketName)
      console.log('userId', userId)
      const deleteFile = async () => {
        const fileName = userId + '.png'
        console.log('fileName', fileName)
        const bucket = await this.storageInstance.storage.bucket(bucketName)
        console.log('bucket', bucket)
        const file = bucket.file(fileName)
        console.log('file', file)
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

  async uploadImage(file: Express.Multer.File, bucketName: string, userId: string) {
    try {
      console.log("bucketName", bucketName)
      console.log("file", file)
      console.log("userId", userId)
      return await this.uploadFile(
        file,
        bucketName,
        userId
      )
    }
    catch (error) {
      console.log(error)
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
