import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Storage } from "@google-cloud/storage";
import path from "path";
import { createWriteStream } from "fs";
import { ApolloServer, gql } from "apollo-server-express";

@Injectable()
export class ImagesService {
  constructor(private prismaService: PrismaService) {}

  files = []

  typeDefs = gql`
    type Query {
      files: [String]
    }
  `

  gcp = new Storage({
    keyFilename: path.join(__dirname, '../filename'),
    projectId: 'projectId'
  })

  buckets = this.gcp.getBuckets().then(buckets => console.log(buckets))

  thriveinBucket = this.gcp.bucket('thrivein-iamges')

  resolvers = {
    Query: {
      files: () => this.files
    },
    Mutation: {
      uploadFile: async (_, { file }) => {
        const { createReadStream, filename } = await file

        await new Promise(res => 
          createReadStream()
            .pipe(
              this.thriveinBucket.file(filename).createWriteStream({
                resumable: false,
                gzip: true
              })
            )
            .on("finish", res)
        )
      }
    }
  }

  AWS_S3_PROFILE_BUCKET = process.env.S3_AWS_PROFILE_BUCKET;
  AWS_S3_GIG_BUCKET = process.env.S3_AWS_POST_BUCKET;
  AWS_S3_EVENT_BUCKET = process.env.S3_AWS_EVENT_BUCKET;
  AWS_S3_WIDGET_BUCKET = process.env.S3_AWS_WIDGET_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    endpoint: "s3.eu-west-1.amazonaws.com",
    region: "eu-west-1.",
  });

  async uploadProfileImage(file: any, id: string) {
    //   const { originalname } = file;
    try {
      return await this.s3_upload(
        file.buffer,
        this.AWS_S3_PROFILE_BUCKET,
        id,
        file.mimetype,
      );
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async uploadPostImage(file: any, id: string) {
    try {
      return await this.s3_upload(
        file.buffer,
        this.AWS_S3_GIG_BUCKET,
        id,
        file.mimetype,
      )
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async uploadWidgetImage(file: any, id: string) {
    try {
      return await this.s3_upload(
        file.buffer,
        this.AWS_S3_WIDGET_BUCKET,
        id,
        file.mimetype,
      ) 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occurred. Please try again.")
    }
  }

  async s3_upload(file: any, bucket: string, id: string, mimetype: string) {
    const params = {
      Bucket: bucket,
      Key: id,
      Body: file,
      ACL: "public-read",
      ContentType: mimetype,
      ContentDisposition: "inline",
      CreateBucketConfiguration: {
        LocationConstraint: "eu-west-1",
      },
    };
    console.log(params)
    try {
      await this.s3.upload(params).promise();
      return await this.s3.getSignedUrlPromise('getObject', {Bucket: bucket, Key: id});
    } catch (error) {
        console.log(error)
        throw new Error("There was an error uploading. Please try again.")
    }
  }

  async downloadProfileImage(Key: string, id: string) {
    const name = id + ".png";
    return await this.s3_download(this.AWS_S3_PROFILE_BUCKET, Key);
  }

  async downloadGigImage(Key: string, id: string) {
    const name = id + ".png";
    return await this.s3_download(this.AWS_S3_GIG_BUCKET, Key);
  }

  async downloadEventImage(Key: string, id: string) {
    const name = id + ".png";
    return await this.s3_download(this.AWS_S3_EVENT_BUCKET, Key);
  }

  async downloadWidgetImage(Key: string, id: string) {
    const name = id + ".png";
    return await this.s3_download(this.AWS_S3_WIDGET_BUCKET, Key);
  }

  async s3_download(bucket: string, key: string) {
    const params = {
      Bucket: bucket,
      Key: String(key),
    };

    console.log("params", params);

    try {
      let s3Response = await this.s3.getObject(params).promise();
      return s3Response;
    } catch (e) {
      console.log("error", e);
    }
  }
}
