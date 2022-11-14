import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    private prismaService: PrismaService
  ) {}

 async create(userId, contacted_userId) {
  try {
  const result =await this.prismaService.contact.create({
  data:{
    userId:userId,
    contacted_userId:contacted_userId  
  }
})
   
    return result;
  }
  catch (error) {
    console.log(`Error Occured, ${error}`);
  }
}

async getContactByContactId(id) {
  try {
    const contact = await this.prismaService.contact.findFirst({
      where:{id:id},
      include:{chat:true}
    });
    console.log("contact",contact);
      if(contact){
        return contact;
      }
      else{
        throw new BadRequestException('contact not found');
      }
  
  } catch (error) {
    console.log(`Error Occured, ${error}`);
  }
};

  async getContactByUserId(id) {
    try {
      const contact = await this.prismaService.contact.findMany({
        where:{userId:id},
        include:{chat:true}
      });
      console.log("contact",contact);
      if(contact){
        return contact;
      }
      else{
        throw new BadRequestException('contact not found');
      }
      
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  };
  
  async getContactByContactedUserId(id) {
    console.log("id",id);
    
    try {
      const contact = await this.prismaService.contact.findMany({
        where:{contacted_userId:id},
        include:{chat:true}
      });
      console.log("contact",contact);
      if(contact){
        return contact;
      }
      else{
        throw new BadRequestException('contact not found');
      }
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  };

  async getAll() {
    try {
      const contact = await this.prismaService.contact.findMany({include:{chat:true}});
      console.log("contact",contact);
      if(contact){
        return contact;
      }
      else{
        throw new BadRequestException('contact not found');
      }
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  };

  

  
  async remove(id) {
    const result= await this.prismaService.contact.delete({
      where:{id:id},
    });
    if(result){
      return { message: "deleted Successfully" } ;
    }
    else{
      return { message: "Something went wrong" };
    }
      
      }


}
