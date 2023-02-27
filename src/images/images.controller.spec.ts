import { Test, TestingModule } from "@nestjs/testing";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";
import * as AWS from "aws-sdk";
import { Context, MockContext, createMockContext } from "../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import * as  streamBuffers from 'stream-buffers'
import * as fs  from "fs";

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context


const AWS_S3_PROFILE_BUCKET = process.env.S3_AWS_PROFILE_BUCKET;
const AWS_S3_GIG_BUCKET = process.env.S3_AWS_GIG_BUCKET;
const AWS_S3_EVENT_BUCKET = process.env.S3_AWS_EVENT_BUCKET;
const AWS_S3_WIDGET_BUCKET = process.env.S3_AWS_WIDGET_BUCKET;
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: "s3.eu-west-1.amazonaws.com",
  region: "eu-west-1.",
});

let Image: File
const req = {
  user: {
    id: '000102030405060708090a0b'
  }
}

describe("ImagesController", () => {
  let controller: ImagesController;

  const fileToBuffer = (filename: string) => {
    const readStream = fs.createReadStream(filename);
    const chunks = [];
    return new Promise((resolve, reject) => {
      readStream.on('error', (error) => {
          reject(error);
      });
      readStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      readStream.on('close', () => {
        resolve(Buffer.concat(chunks))
      })
    })
  }

  let imageBuffer: Buffer
  const imageFiles: Express.Multer.File[] = [];
        const myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
          frequency: 10, // in milliseconds.
          chunkSize: 2048, // in bytes.
        });
        myReadableStreamBuffer.put(imageBuffer as Buffer);
        imageFiles.push({
          buffer: imageBuffer,
          fieldname: 'fieldname-defined-in-@UseInterceptors-decorator',
          originalname: 'original-filename',
          encoding: '7bit',
          mimetype: 'file-mimetyp',
          destination: 'destination-path',
          filename: 'file-name',
          path: 'file-path',
          size: 955578,
          stream: myReadableStreamBuffer,
        });

  const s3_upload = async (file: any, bucket: string, name: string, mimetype: string, userId: string) => {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: "public-read",
      ContentType: mimetype,
      ContentDisposition: "inline",
      CreateBucketConfiguration: {
        LocationConstraint: "eu-west-1",
      },
    }
  
    try {
      let s3Response = await s3.upload(params).promise();
      const updatedUserImage = await prisma.user.update({
        where: { id: userId },
        data: { profileImage: s3Response.Key },
      });
      return s3Response;
    } catch (error) {
      console.log(error)
      throw new Error("There was an error uploading. Please try again.")
    }
  }

  const s3_download = async (bucket: string, key: string) => {
    const params = {
      Bucket: bucket,
      Key: String(key),
    };

    console.log("params", params);

    try {
      let s3Response = await s3.getObject(params).promise();
      return s3Response;
    } catch (error) {
      console.log(error)
      throw new Error("There was an error uploading the image. Please try again.")
    }
  }

  let mockImageService = {
    uploadProfileImage: jest.fn().mockImplementation(async (file: any, id: string) => {
      try {
        const name = id + ".png";
        return await s3_upload(
          file.buffer,
          AWS_S3_PROFILE_BUCKET,
          name,
          file.mimetype,
          id
        )
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occurred. Please try again.")
      }
    }),

    uploadGigImage: jest.fn().mockImplementation(async (file: any, id: string) => {
      try {
        const name = id + ".png";
        return await s3_upload(
          file.buffer,
          AWS_S3_GIG_BUCKET,
          name,
          file.mimetype,
          id
        )
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occurred. Please try again.")
      }
    }),

    uploadEventImage: jest.fn().mockImplementation(async (file: any, id: string) => {
      try {
        const name = id + ".png";
        return await s3_upload(
          file.buffer,
          AWS_S3_EVENT_BUCKET,
          name,
          file.mimetype,
          id
        ) 
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occurred. Please try again.")
      }
    }),

    uploadWidgetImage: jest.fn().mockImplementation(async (file: any, id: string) => {
      try {
        const name = id + ".png";
        return await s3_upload(
          file.buffer,
          AWS_S3_WIDGET_BUCKET,
          name,
          file.mimetype,
          id
        ) 
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occurred. Please try again.")
      }
    }),

    downloadProfileImage: jest.fn().mockImplementation(async (Key: string, id: string) => {
      const name = id + ".png";
      return await s3_download(AWS_S3_PROFILE_BUCKET, Key)
    }),

    downloadGigImage: jest.fn().mockImplementation(async (Key: string, id: string) => {
      const name = id + ".png";
      return await s3_download(AWS_S3_GIG_BUCKET, Key);
    }),

    downloadEventImage: jest.fn().mockImplementation(async (Key: string, id: string) => {
      const name = id + ".png";
      return await s3_download(AWS_S3_EVENT_BUCKET, Key);
    }),

    downloadWidgetImage: jest.fn().mockImplementation(async (Key: string, id: string) => {
      const name = id + ".png";
      return await s3_download(AWS_S3_WIDGET_BUCKET, Key);
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [ImagesService],
    })
    .overrideProvider(ImagesService)
    .useValue(mockImageService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<ImagesController>(ImagesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should define an endpoint to upload a profile image", () => {
    expect(controller.uploadProfileImage).toBeDefined()
  })

  it("should upload a profile image", async () => {
    const imageBuffer = (await fileToBuffer(
      __dirname + '/mock-upload-image.png',
    )) as Express.Multer.File;
    // const uploadedImage = await controller.uploadProfileImage(imageBuffer[0], req)
    // console.log(uploadedImage)
  })

  it("should define an endpoint to upload a gig image", () => {
    expect(controller.uploadGigImage).toBeDefined()
  })

  it("should upload a gig image", async () => {
    const imageBuffer = (await fileToBuffer(
      __dirname + '/mock-upload-image.png',
    )) as Express.Multer.File;
    // const uploadedImage = await controller.uploadGigImage(imageBuffer[0], req)
    // console.log(uploadedImage)
  })

  it("should define an endpoint to upload an event image", () => {
    expect(controller.uploadGigImage).toBeDefined()
  })

  it("should upload an event image", async () => {
    const imageBuffer = (await fileToBuffer(
      __dirname + '/mock-upload-image.png',
    )) as Express.Multer.File;
    // const uploadedImage = await controller.uploadEventImage(imageBuffer[0], req)
    // console.log(uploadedImage)
  })

  it("should define an endpoint to upload a widget image", () => {
    expect(controller.uploadWidgetImage).toBeDefined()
  })

  it("should upload a widget image", async () => {
    const imageBuffer = (await fileToBuffer(
      __dirname + '/mock-upload-image.png',
    )) as Express.Multer.File;
    // const uploadedImage = await controller.uploadWidgetImage(imageBuffer[0], req)
    // console.log(uploadedImage)
  })

  it("should define an endpoint to download an image by the Key", () => {
    expect(controller.downloadImage).toBeDefined()
  })

  it("should download an image by the image key", async () => {
    // const downloadedImage = await controller.downloadImage("Key", req)
    // console.log(downloadedImage)
  }) 
})
