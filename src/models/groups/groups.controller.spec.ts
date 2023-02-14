import { Test, TestingModule } from "@nestjs/testing";
import { GroupsController } from "./groups.controller";
import { GroupsService } from "./groups.service";
import { BadRequestException } from "@nestjs/common";
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

describe("GroupsController", () => {
  let controller: GroupsController

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
      controllers: [GroupsController],
      providers: [GroupsService, PrismaService],
    })
    .overrideProvider(GroupsService)
    .useValue(mockGroupsService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<GroupsController>(GroupsController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  it("should define a function to create a group", () => {
    expect(controller.create).toBeDefined()
  })

  let group: any
  it("should create a new group and post to the database", async () => {
    const createdGroup = await controller.create(createGroupDto, userId)
    console.log('createdGroup', createdGroup)
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
    expect(controller.findAll).toBeDefined()
  })

  it("should find all of the groups and return them", async () => {
    const allGroups = await controller.findAll()
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
    expect(controller.findOne).toBeDefined()
  })

  it("should find one of the groups and return it", async () => {
    const oneGroup = await controller.findOne(group.id)
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
    expect(controller.update).toBeDefined()
  })

  it("should update a group by id", async () => {
    const updatedGroup = await controller.update(group.id, updateGroupDto)
    expect(updatedGroup).toEqual(
      { message: "Updated Successfully" }
    )
  })

  it("should define a function to remove a group by id", () => {
    expect(controller.remove).toBeDefined()
  })

  it("should remove a group id", async () => {
    const removedGroup = await controller.remove(group.id)
    expect(removedGroup).toEqual(
      { message: "Deleted Successfully" }
    )
    const findDeletedGroup = await controller.findOne(group.id)
    expect(findDeletedGroup).toEqual(null)
  })
})
