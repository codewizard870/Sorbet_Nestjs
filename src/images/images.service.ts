import { Injectable } from "@nestjs/common";
import { Storage as GCPStorage } from "@google-cloud/storage";
import path from "path";

@Injectable()
export class ImagesService {
  constructor() {}
  secretContent = process.env.GCP_KEY_FILE_NAME;
  // localPath = path.join(
  //   __dirname,
  //   "../../sorbet-405010-948196898c80.json"
  // );

  // keyFilename = process.env.NODE_ENV === 'production' ? this.secretContent : this.localPath
  // keyFilename = this.secretContent;

  storage = new GCPStorage({
    keyFilename: this.secretContent,
    projectId: "sorbet-405010",
  });

  uploadFile = async (
    file: Express.Multer.File,
    bucketName: string,
    userId: string,
    fileType?: string
  ) => {
    const fileExtention = fileType === "video" ? ".mp4" : ".png";
    const storage = this.storage;
    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${userId}${fileExtention}`;
    const contentType = fileType === "video" ? "video/mp4" : "image/png";
    const metadata = { contentType };
    const stream = bucket.file(gcsFileName).createWriteStream({ metadata });

    // Set up stream event listeners
    stream.on("error", (error) => {
      console.error(error);
    });

    stream.on("finish", async () => {
      await bucket.file(gcsFileName).makePublic();
    });

    stream.end(file.buffer);

    const fileUrl = await new Promise<string>((resolve, reject) => {
      stream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
        resolve(publicUrl);
      });

      stream.on("error", (error) => {
        reject(error);
      });
    });
    return { fileUrl };
  };

  getFileMetadata = async (
    isVideo: boolean,
    bucketName: string,
    userId: string
  ) => {
    try {
      const fileExtention = isVideo ? ".mp4" : ".png";
      const bucket = this.storage.bucket(bucketName);
      const gcsFileName = `${userId}${fileExtention}`;

      const file = bucket.file(gcsFileName);
      const [metadata] = await file.getMetadata();

      return metadata;
    } catch (error) {
      console.error(error);
    }
  };

  downloadFile = async (
    isVideo: boolean,
    bucketName: string,
    userId: string
  ) => {
    try {
      const fileExtention = isVideo ? ".mp4" : ".png";
      const bucket = this.storage.bucket(bucketName);
      const gcsFileName = `${userId}${fileExtention}`;

      const file = bucket.file(gcsFileName);
      const stream = file.createReadStream();

      stream.on("error", (err) => {
        console.error(err);
        throw new Error("File not found");
      });

      stream.on("response", (response) => {
        response.headers["Content-Type"] = "image/png";
        response.headers[
          "Content-Disposition"
        ] = `attachment; filename="${gcsFileName}"`;
      });

      return stream;
    } catch (error) {
      console.error(error);
    }
  };

  deleteFile = async (isVideo: boolean, bucketName: string, userId: string) => {
    try {
      const fileExtention = isVideo ? ".mp4" : ".png";
      const gcsFileName = `${userId}${fileExtention}`;
      const bucket = await this.storage.bucket(bucketName);
      const file = bucket.file(gcsFileName);
      await file.delete();

      console.log(`gs://${bucketName}/${gcsFileName} deleted`);
      return {
        message: `Successfully deleted file: ${gcsFileName} from bucket: ${bucketName}`,
      };
    } catch (error) {
      console.error(error);
    }
  };

  async upload(
    file: Express.Multer.File,
    bucketName: string,
    userId: string,
    fileType?: string
  ) {
    console.log(file, "avatar");
    try {
      return await this.uploadFile(file, bucketName, userId, fileType);
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred. Please try again.");
    }
  }

  async uploadAvatar(
    file: Express.Multer.File,
    bucketName: string,
    userId: string,
    fileType?: string
  ) {
    try {
      return await this.uploadFile(file, bucketName, userId, fileType);
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred. Please try again.");
    }
  }

  async getMetadata(isVideo: boolean, bucketName: string, userId: string) {
    return await this.getFileMetadata(isVideo, bucketName, userId);
  }

  async download(isVideo: boolean, bucketName: string, userId: string) {
    return await this.downloadFile(isVideo, bucketName, userId);
  }

  async delete(isVideo: boolean, bucketName: string, userId: string) {
    return await this.deleteFile(isVideo, bucketName, userId);
  }
}
