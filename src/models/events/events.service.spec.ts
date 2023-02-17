import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { EventsService } from "./events.service";
import { TimezonesService } from "src/timezones/timezones.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { CreateTimezoneDto } from "src/timezones/dto/create-timezone.dto";
import { UpdateTimezoneDto } from "src/timezones/dto/update-timezone.dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import { AnyCatcher } from "rxjs/internal/AnyCatcher";

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createEventDto: CreateEventDto = {
  postId: "000102030405060708090a0b",
  name: "first event",
  event_image: 'image_link.png',
  start_date: new Date(Date.now()),
  end_date: new Date(Date.now()),
  timezone: new Date(Date.now()),
  event_link: 'event.com/event',
  description: 'a very fun event!'
}

const updateEventDto: UpdateEventDto = {
  name: 'updated first event'
}

describe("EventsService", () => {
  let service: EventsService;

  let mockTimezonesService = {
    create: jest.fn().mockImplementation(async (createTimezoneDto: CreateTimezoneDto) => {
      return (createTimezoneDto)
    }),

    convertToUtc: jest.fn().mockImplementation(async (getdate: any) => {
      const date = new Date(getdate)
      var new_utc = new Date(date.toUTCString())
      return new_utc
    }),

    findAll: jest.fn().mockImplementation(async () => {
      return `This action returns all timezones`
    }),

    findOne: jest.fn().mockImplementation(async (id: number) => {
      return `This action returns a #${id} timezone`
    }),

    update: jest.fn().mockImplementation(async (id: number, updateTimezoneDto: UpdateTimezoneDto) => {
      return `This action updates a #${id} timezone`
    }),

    remove: jest.fn().mockImplementation(async (id: number) => {
      return `This action removes a #${id} timezone`
    })
  }

  let mockEventsService = {
    create: jest.fn().mockImplementation(async (data: CreateEventDto) => {
      try {
        const utcStartDate = await mockTimezonesService.convertToUtc(data.start_date)
        const utcEndDate = await mockTimezonesService.convertToUtc(data.end_date)
    
        const result = await prisma.event.create({
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
        } else {
          throw new BadRequestException();
        } 
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAll: jest.fn().mockImplementation(async () => {
      try {
        const allEvents =  await prisma.event.findMany({
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
    }),

    findOne: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const event = await prisma.event.findFirst({
          where: { id: _id },
          include: { location: true },
        })
        if (event) {
          return event
        }
        else {
          console.log('Failed to find event.')
          return { message: 'Failed to find event.' }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    update: jest.fn().mockImplementation(async (id: string, updateEventDto: UpdateEventDto) => {
      try {
        const updatedEvent = await prisma.event.update({
          where: { id: id },
          data: updateEventDto
        })
        if (updatedEvent) {
          return { message: `Successfully updated event` }
        }
        else {
          console.log(`Failed to update event ${id}`)
          return { message: `Failed to update event` }
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("Failed to update event.")
      }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      try {
        const removedEvent = await prisma.event.delete({
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
    }),
  }

  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService, PrismaService, TimezonesService],
    })
    .overrideProvider(EventsService)
    .useValue(mockEventsService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<EventsService>(EventsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  })

  it("should define a function to create an event", () => {
    expect(service.create).toBeDefined()
  })

  let event: any
  it("should create an event", async () => {
    const createdEvent = await service.create(createEventDto)
    event = createdEvent
    expect(service.create).toBeCalled()
    expect(createdEvent).toEqual({
      id: expect.any(String),
        event_image: expect.any(String),
        event_link: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        timezone: expect.any(Date),
        start_date: expect.any(Date),
        end_date: expect.any(Date),
        postId: expect.any(String),
    })
  })

  it("should define a function to get all of the events", () => {
    expect(service.findAll).toBeDefined()
  })

  it("should get all of the events and return them", async () => {
    const allEvents = await service.findAll()
    expect(service.findAll).toBeCalled()
    expect(allEvents).toEqual(expect.any(Array))
    expect(allEvents[0]).toEqual({
        id: expect.any(String),
        event_image: expect.any(String),
        event_link: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        timezone: expect.any(Date),
        start_date: expect.any(Date),
        end_date: expect.any(Date),
        postId: expect.any(String),
    })
  })

  it("should define a function to get one event by the id", () => {
    expect(service.findOne).toBeDefined()
  })

  it("should get one of the events by the id and return it", async () => {
    const oneEvent = await service.findOne(event.id)
    expect(service.findOne).toBeCalled()
    expect(oneEvent).toEqual({
        id: expect.any(String),
        event_image: expect.any(String),
        event_link: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        timezone: expect.any(Date),
        start_date: expect.any(Date),
        end_date: expect.any(Date),
        postId: expect.any(String),
        location: []
    })
  })

  it("should define a function to update an event by the id", () => {
    expect(service.update).toBeDefined()
  })

  it("should update an event by the id", async () => {
    const updatedEvent = await service.update(event.id, updateEventDto)
    expect(service.update).toBeCalled()
    expect(updatedEvent).toEqual(expect.any(Object))
    expect(updatedEvent).toEqual(
      { message: `Successfully updated event` }
    )
    const findUpdatedEvent = await service.findOne(event.id)
    expect(service.findOne).toBeCalled()
    expect(findUpdatedEvent).toEqual(expect.any(Object))
    expect(findUpdatedEvent).toEqual({
      id: expect.any(String),
      event_image: expect.any(String),
      event_link: expect.any(String),
      name: updateEventDto.name,
      description: expect.any(String),
      timezone: expect.any(Date),
      start_date: expect.any(Date),
      end_date: expect.any(Date),
      postId: expect.any(String),
      location: []
    })
  })

  it("should define a function to remove an event by the id", () => {
    expect(service.remove).toBeDefined()
  })

  it("should remove an event by the id", async () => {
    const removedEvent = await service.remove(event.id)
    expect(service.remove).toBeCalled()
    expect(removedEvent).toEqual(expect.any(Object))
    expect(removedEvent).toEqual(
      { message: `Successfully removed event` }
    )
    const findDeletedEvent = await service.findOne(event.id)
    expect(service.remove).toBeCalled()
    expect(findDeletedEvent).toEqual(expect.any(Object))
    expect(findDeletedEvent).toEqual(
      { message: 'Failed to find event.' }
    )
  })
})
