import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ContactsService } from "./contacts.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
@ApiBearerAuth()
@ApiTags("Contacts")
@Controller("/contacts")
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post(":contacted_userId")
  async create(
    @Param("contacted_userId") contacted_userId: string,
    @Request() req
  ) {
    const userId = req.user.id;
    console.log("userId", userId);

    return await this.contactsService.create(userId, contacted_userId);
  }

  @Get()
  async findAll() {
    return await this.contactsService.getAll();
  }

  @Get("myContacts")
  async findOneByUserId(@Request() req) {
    return await this.contactsService.getContactByUserId(req.user.id);
  }

  @Get(":contactedUserId")
  async findContactByContactedUserId(
    @Param("contactedUserId") contactedUserId: string
  ) {
    return await this.contactsService.getContactByContactedUserId(
      contactedUserId
    );
  }

  @Get("/findByContactId/:contactId")
  async ContactByContactId(@Param("contactId") contactId: string) {
    return await this.contactsService.getContactByContactId(contactId);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.contactsService.remove(id);
  }
}
