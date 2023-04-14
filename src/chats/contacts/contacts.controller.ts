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

  @Post("create")
  async create(@Body() createContactDto: CreateContactDto) {
    return await this.contactsService.create(createContactDto);
  }

  @Get()
  async findAll() {
    return await this.contactsService.getAll();
  }

  @Get("myContacts/:userId")
  async findOneByUserId(@Param("userId") userId: string) {
    return await this.contactsService.getContactByUserId(userId);
  }

  @Get(":contactedUserId")
  async findContactByContactedUserId(@Param("contactedUserId") contactedUserId: string) {
    return await this.contactsService.getContactByContactedUserId(contactedUserId);
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
