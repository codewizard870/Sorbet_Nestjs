import { Injectable } from "@nestjs/common";
import { Storage as GCPStorage } from '@google-cloud/storage';
import path from "path";


@Injectable()
export class ImagesService {
  constructor() {}

  secretContent = process.env['aerobic-badge-379110-bcaae1f06e2b']
  // localPath = path.join(__dirname, '../../aerobic-badge-379110-bcaae1f06e2b.json')

  // keyFilename = process.env.NODE_ENV === 'production' ? this.secretContent : this.localPath
  keyFilename = this.secretContent

  storage = new GCPStorage({
    keyFilename: this.keyFilename,
    projectId: 'aerobic-badge-379110',
  })
  
  uploadFile = async (file: Express.Multer.File, fileType: string, bucketName: string, userId: string) => {
    const fileExtention = fileType === 'image' ? '.png' : fileType === 'video' ? '.mp4' : null;
    const storage = this.storage;
    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${userId}${fileExtention}`;
    const options = {
      metadata: {
        contentType: fileType === 'image' ? 'image/png' : 'video/mp4',
      },
    };
  
    const stream = bucket.file(gcsFileName).createWriteStream(options);
    stream.on('error', (error) => {
      console.error(error);
    });
  
    stream.on('finish', async () => {
      await bucket.file(gcsFileName).makePublic();
    });
  
    stream.end(file.buffer);
  
    const fileUrl = await new Promise<string>((resolve, reject) => {
      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
        resolve(publicUrl);
      });
  
      stream.on('error', (error) => {
        reject(error);
      });
    });
  
    return { fileUrl };
  }

  getFileMetadata = async (fileType: string, bucketName: string, userId: string) => {
    try {
      const fileExtention = fileType === 'image' ? '.png' : fileType === 'video' ? '.mp4' : null;
      const bucket = this.storage.bucket(bucketName)
      const gcsFileName = `${userId}${fileExtention}`;

      const file = bucket.file(gcsFileName)
      const [metadata] = await file.getMetadata()

      return metadata
    }
    catch (error) {
      console.error(error)
    }
  }

  downloadFile = async (fileType: string, bucketName: string, userId: string) => {
    try {
      const fileExtention = fileType === 'image' ? '.png' : fileType === 'video' ? '.mp4' : null;
      const bucket = this.storage.bucket(bucketName)
      const gcsFileName = `${userId}${fileExtention}`;

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

  deleteFile = async (fileType: string, bucketName: string, userId: string) => {
    try {
        const fileExtention = fileType === 'image' ? '.png' : fileType === 'video' ? '.mp4' : null;
        const gcsFileName = `${userId}${fileExtention}`;
        const bucket = await this.storage.bucket(bucketName)
        const file = bucket.file(gcsFileName)
        await file.delete()

        console.log(`gs://${bucketName}/${gcsFileName} deleted`)
        return { message: `Successfully deleted file: ${gcsFileName} from bucket: ${bucketName}` }
    }
    catch (error) {
      console.error(error)
    }
  }

  async upload(file: Express.Multer.File, fileType: string, bucketName: string, userId: string) {
    try {
      return await this.uploadFile(
        file,
        fileType,
        bucketName,
        userId
      )
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async getMetadata(fileType: string, bucketName: string, userId: string) {
    return await this.getFileMetadata(
      fileType,
      bucketName,
      userId
    )
  }

  async download(fileType: string, bucketName: string, userId: string) {
    return await this.downloadFile(
      fileType,
      bucketName,
      userId
    )
  }

  async delete(fileType: string, bucketName: string, userId: string) {
    return await this.deleteFile(
      fileType,
      bucketName,
      userId
    )
  }
}
