import { Injectable } from '@nestjs/common';
import * as AWS from "aws-sdk";
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class ImagesService {
constructor(private prismaService:PrismaService){}
    
  AWS_S3_PROFILE_BUCKET = process.env.S3_AWS_PROFILE_BUCKET;
  AWS_S3_GIG_BUCKET = process.env.S3_AWS_GIG_BUCKET
  AWS_S3_EVENT_BUCKET = process.env.S3_AWS_EVENT_BUCKET
    s3 = new AWS.S3
  ({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
       endpoint: 's3.eu-west-1.amazonaws.com' ,
       region: 'eu-west-1.'
  });

  async uploadProfileImage(file,id)
  {
    //   const { originalname } = file;
      const name=id+".png";
      return  await this.s3_upload(file.buffer, this.AWS_S3_PROFILE_BUCKET, name, file.mimetype,id);
  }

  
  async uploadGigImage(file,id)
  {
    //   const { originalname } = file;
      const name=id+".png";
      return  await this.s3_upload(file.buffer, this.AWS_S3_GIG_BUCKET, name, file.mimetype,id);
  }
  
  async uploadEventImage(file,id)
  {
    //   const { originalname } = file;
      const name=id+".png";
      return  await this.s3_upload(file.buffer, this.AWS_S3_EVENT_BUCKET, name, file.mimetype,id);
  }

  async s3_upload(file, bucket, name, mimetype,userId)
  {
      const params = 
      {
          Bucket: bucket,
          Key: String(name),
          Body: file,
          ACL: "public-read",
          ContentType: mimetype,
          ContentDisposition:"inline",
          CreateBucketConfiguration: 
          {
              LocationConstraint: "eu-west-1"
          }
      };

      console.log('params',params);

      try
      {
          let s3Response = await this.s3.upload(params).promise();
const updatedUserImage=await this.prismaService.user.update({
    where:{id:userId},
    data:{profileImage:s3Response.Key}
})
          return s3Response;

        }
      catch (e)
      {
          console.log("error",e);
      }
  }

  
  async downloadProfileImage(Key,id)
  {
    const name=id+".png";
     return await this.s3_download( this.AWS_S3_PROFILE_BUCKET,Key);
    }

    async downloadGigImage(Key,id)
    {
       const name=id+".png";        
   return await this.s3_download( this.AWS_S3_GIG_BUCKET,Key);
      }

      async downloadEventImage(Key,id)
      {
          const name=id+".png";
     return await this.s3_download( this.AWS_S3_EVENT_BUCKET,Key);
        }

  async s3_download( bucket, key)
  {
      const params = 
      {
          Bucket: bucket,
          Key: String(key)
      };

      console.log('params',params);

      try
      {
       let s3Response = await this.s3.getObject(params).promise();
        return s3Response;
      }
      catch (e)
      {
          console.log("error",e);
      } 
     }
    }
