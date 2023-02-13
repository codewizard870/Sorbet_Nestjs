import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { TimezonesService } from "src/timezones/timezones.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createGroupDto: CreateGroupDto = {
  name: 'Group 1',
  description: 'The first group',
  image: 'First group image',
  group_owner: '000102030405060708090a0b',
  userIDs: [],
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
}

const updateGroupDto: UpdateGroupDto = {
name: 'Group 2'
}

const userId = '000102030405060708090a0b'

describe("GroupsService", () => {
  let service: GroupsService;

  let mockGroupsService = {
    create: jest.fn().mockImplementation(async (data: CreateGroupDto, userId: string) => {
      try {
        const result = await prisma.group.create({
          data: {
            name: data.name,
            description: data.description,
            image: data.image,
            group_owner: userId,
            userIDs: data.userIDs,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          }
        })
        if (result) {
          return result
        } 
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findAll: jest.fn().mockImplementation(async () => {
      try {
        return await prisma.group.findMany({
          include: { members: true },
        })
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    findOne: jest.fn().mockImplementation(async (_id: string) => {
      try {
        const group = await prisma.group.findFirst({
          where: { id: _id },
          include: { members: true },
        });
        return group
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    update: jest.fn().mockImplementation(async (id: string, updateGroupDto: UpdateGroupDto) => {
      const result = await prisma.group.update({
        where: { id: id },
        data: updateGroupDto,
      })
      if (result) {
        return { message: "Updated Successfully" }
      }
      else {
        return { message: "Something went wrong" }
      }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      const result = await prisma.group.delete({
        where: { id: id },
      })
      if (result) {
        return { message: "Deleted Successfully" };
      } 
      else {
        return { message: "Something went wrong" };
      }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService, PrismaService, TimezonesService],
    })
    .overrideProvider(GroupsService)
    .useValue(mockGroupsService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<GroupsService>(GroupsService)
  });

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should define a function to create a group", () => {
    expect(service.create).toBeDefined()
  })

  let group: any
  it("should create a new group and post to the database", async () => {
    const createdGroup = await service.create(createGroupDto, userId)
    expect(service.create).toBeCalled()
    console.log(createdGroup)
    group = createdGroup
    expect(createdGroup).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      image: expect.any(String),
      group_owner: expect.any(String),
      userIDs: expect.any(Array),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it("should define a function to find all the groups", () => {
    expect(service.findAll).toBeDefined()
  })

  it("should find all of the groups and return them", async () => {
    const allGroups = await service.findAll()
    expect(service.findAll).toBeCalled()
    console.log(allGroups)
    expect(allGroups).toEqual(expect.any(Array))
    expect(allGroups[0]).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      image: expect.any(String),
      group_owner: expect.any(String),
      userIDs: expect.any(Array),
      members: expect.any(Array),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it("should define a function to find one group by id", () => {
    expect(service.findOne).toBeDefined()
  })

  it("should find one of the groups and return it", async () => {
    const oneGroup = await service.findOne(group.id)
    expect(service.findOne).toBeCalled()
    console.log(oneGroup)
    expect(oneGroup).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      image: expect.any(String),
      group_owner: expect.any(String),
      userIDs: expect.any(Array),
      members: expect.any(Array),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it("should define a function to update a group by id", () => {
    expect(service.update).toBeDefined()
  })

  it("should update a group by id", async () => {
    const updatedGroup = await service.update(group.id, updateGroupDto)
    expect(service.update).toBeCalled()
    expect(updatedGroup).toEqual(
      { message: "Updated Successfully" }
    )
  })

  it("should define a function to remove a group by id", () => {
    expect(service.remove).toBeDefined()
  })

  it("should remove a group id", async () => {
    console.log('group', group)
    const removedGig = await service.remove(group.id)
    expect(service.remove).toBeCalled()
    expect(removedGig).toEqual(
      { message: "Deleted Successfully" }
    )
    const findDeletedGroup = await service.findOne(group.id)
    expect(findDeletedGroup).toEqual(null)
  })
})
