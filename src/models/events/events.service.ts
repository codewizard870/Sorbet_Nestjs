import { BadRequestException, Injectable } from "@nestjs/common";
import { TimezonesService } from "src/timezones/timezones.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { ContactsModule } from "src/chats/contacts/contacts.module";

@Injectable()
export class EventsService {
  constructor(
    private prismaService: PrismaService,
    private timezonesService: TimezonesService
  ) {}

  async create(data: CreateEventDto) {
    try {
      const utcStartDate = this.timezonesService.convertToUtc(data.start_date);
      const utcEndDate = this.timezonesService.convertToUtc(data.end_date);
  
      const result = await this.prismaService.event.create({
        data: {
          postId: data.postId,
          name: data.name,
          event_image: data.event_image,
  
          start_date: utcStartDate,
          end_date: utcEndDate,
  
          event_link: data.event_link,
          description: data.description,
          timezone: data.timezone,
        },
      });
      if (result) {
        return result;
      } 
      else {
        throw new BadRequestException();
      } 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findAll() {
    try {
      const allEvents =  await this.prismaService.event.findMany({
        include: { 
          post: true, 
          location: true 
        },
      })
      if (allEvents) {
        return allEvents
      }
      else {
        console.log("Failed to find all events")
        return { message: 'Failed to find all events' }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findOne(_id: string) {
    try {
      const event = await this.prismaService.event.findFirst({
        where: { id: _id },
        include: { location: true },
      })
      return event
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    try {
      const updatedEvent = await this.prismaService.event.update({
        where: { id: id },
        data: updateEventDto
      })
      if (updatedEvent) {
        return { message: `Successfully updated event` }
      }
      else {
        console.log(`Failed to remove event ${id}`)
        return { message: `Failed to update event` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to remove event.")
    }
  }

  async remove(id: string) {
    try {
      const removedEvent = await this.prismaService.event.delete({
        where: { id: id },
      })
      if (removedEvent) {
        return { message: `Successfully removed event` }
      }
      else {
        console.log(`Failed to remove event ${id}`)
        return { message: `Failed to remove event` }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("Failed to remove event.")
    }
  }
}
