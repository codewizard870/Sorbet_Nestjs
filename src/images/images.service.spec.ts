import { Test, TestingModule } from "@nestjs/testing";
import { ImagesService } from "./images.service";
import * as AWS from "aws-sdk";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Context, MockContext, createMockContext } from "../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const AWS_S3_PROFILE_BUCKET = process.env.S3_AWS_PROFILE_BUCKET;
const AWS_S3_GIG_BUCKET = process.env.S3_AWS_GIG_BUCKET;
const AWS_S3_EVENT_BUCKET = process.env.S3_AWS_EVENT_BUCKET;
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: "s3.eu-west-1.amazonaws.com",
  region: "eu-west-1.",
});

const Image = 'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png'

describe("ImagesService", () => {
  let service: ImagesService;

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
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService, PrismaService],
    })
    .overrideProvider(ImagesService)
    .useValue(mockImageService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<ImagesService>(ImagesService)
  });

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should define a function to upload a profile image", () => {
    expect(service.uploadProfileImage).toBeDefined()
  })

  it("should upload a profile image", async () => {
    // const uploadedProfileImage = await service.uploadProfileImage(Image, "id")
    // console.log(uploadedProfileImage)
    // expect(service.uploadProfileImage).toBeCalled()
    // expect(service.uploadProfileImage).toEqual({

    // })
  })

  it("should define a function to upload a gig image", () => {
    expect(service.uploadGigImage).toBeDefined()
  })

  it("should upload a gig image", async () => {
    // const uploadedGigImage = await service.uploadGigImage(Image, "id")
    // console.log(uploadedGigImage)
    // expect(service.uploadGigImage).toBeCalled()
    // expect(service.uploadProfileImage).toEqual({

    // })
  })

  it("should define a function to upload an event image", () => {
    expect(service.uploadEventImage).toBeDefined()
  })

  it("should upload an event image", async () => {
    // const uploadedEventImage = await service.uploadEventImage(Image, "id")
    // console.log(uploadedEventImage)
    // expect(service.uploadEventImage).toBeCalled()
    // expect(service.uploadProfileImage).toEqual({

    // })
  })

  it("should define a function to download a profile image", () => {
    expect(service.downloadProfileImage).toBeDefined()
  })

  it("should download a profile image", async () => {
    // const downloadedProfileImage = await service.downloadProfileImage("Key", "id")
    // console.log(downloadedProfileImage)
    // expect(service.downloadProfileImage).toBeCalled()
    // expect(service.uploadProfileImage).toEqual({

    // })
  })

  it("should define a function to download a profile image", () => {
    expect(service.downloadProfileImage).toBeDefined()
  })

  it("should download a gig image", async () => {
    // const downloadedGigImage = await service.downloadGigImage("Key", "id")
    // console.log(downloadedGigImage)
    // expect(service.downloadGigImage).toBeCalled()
    // expect(service.uploadProfileImage).toEqual({

    // })
  })

  it("should define a function to download an event image", () => {
    expect(service.downloadProfileImage).toBeDefined()
  })

  it("should download an event image", async () => {
    // const downloadedEventImage = await service.downloadEventImage("Key", "id")
    // console.log(downloadedEventImage)
    // expect(service.downloadEventImage).toBeCalled()
    // expect(service.uploadProfileImage).toEqual({

    // })
  })
});
