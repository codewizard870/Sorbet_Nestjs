import { Test, TestingModule } from "@nestjs/testing";
import { WidgetsController } from "./widgets.controller";
import { WidgetsService } from "./widgets.service";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateWidgetDto } from "./dto/create-widgets-dto";
import { UpdateWidgetDto } from "./dto/update-widgets-dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const createWidgetDto: CreateWidgetDto = {
  name: 'Widget',
  description: 'Test Widget',
  type: 'NFT',
  image: '',
  nft_metadata: '',
  project_link: '',
  userId: '000102030405060708090a0b',
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now())
}

const updateWidgetDto: UpdateWidgetDto = {
    name: 'Updated Widget',
    description: 'Updated Test Widget'
}

describe("WidgetsContoller", () => {
  let controller: WidgetsController;

  let mockWidgetsService = {
    create: jest.fn().mockImplementation(async (data: any) => {
      try {
        const user = prisma.user.findFirst({
          where: { id: data.userId }
        })
        console.log('user', user)

        // const widgets = user.widgets
        // const nftCheck = widgets.includes(data.nft_metadata)
        // const imageCheck = widgets.includes(data.image)
        // const projectLink = widgets.includes(data.project_link)

        // if (nftCheck || imageCheck || projectLink) {
        //   console.log('Widget already exists')
        //   return { message: 'Widget already exists' }
        // }
        // else {

        // }

        const result = await prisma.widget.create({
          data: {
            name: data.name,
            description: data.description,
            type: data.type,
            image: data.image,
            nft_metadata: data.nft_metadata,
            project_link: data.project_link,
            userId: data.userId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          }
        })
        if (result) {
          return result
        }
        else {
          console.log('Failed to create widget.')
          return { message: 'Failed to create widget' }
        }
      }
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }),

    getWidgetById: jest.fn().mockImplementation(async (id: string) => {
      try {
          const widgetById = await prisma.widget.findFirst({
              where: { id: id }
          })
          if (widgetById) {
              return widgetById
          }
          else {
              console.log('Could not find widget by id')
              return { message: 'Could not find widget by id' }
          }
      } 
      catch (error) {
          console.log(error)
          throw new Error("An error occured. Please try again.")
      }
    }),

    getWidgetByUserId: jest.fn().mockImplementation(async (userId: any) => {
      try {
          const result = await prisma.widget.findFirst({
            where: {userId: userId},
          })
          if (result) {  
            return result
          }
          else {
            console.log("Could not find widget by userId")
            return { message: 'Could not find widget by userId' }
          }
        } 
      catch (error) {
          console.log(error)
          throw new Error("An error occured. Please try again.")
      }
    }),

    getWidgetFromImage: jest.fn().mockImplementation(async (image: string) => {
      try {
          const result = await prisma.widget.findFirst({
            where: {image: image},
          })
          if (result) {  
            return result
          }
          else {
            console.log("Could not find widget by images")
            return { message: 'Could not find widget by images' }
          }
        } 
      catch (error) {
          console.log(error)
          throw new Error("An error occured. Please try again.")
      }
    }),

    getWidgetFromNFTMetadata: jest.fn().mockImplementation(async (nft_metadata: string) => {
      try {
          const result = await prisma.widget.findFirst({
            where: {nft_metadata: nft_metadata},
          })
          if (result) {  
            return result
          }
          else {
            console.log("Could not find widget by nfts")
            return { message: 'Could not find widget by nfts' }
          }
        } 
      catch (error) {
          console.log(error)
          throw new Error("An error occured. Please try again.")
      }
    }),

    getWidgetFromProjectLink: jest.fn().mockImplementation(async (project_link: any) => {
      try {
          const result = await prisma.widget.findFirst({
            where: {project_link: project_link},
          })
          if (result) {  
            return result
          }
          else {
            console.log("Could not find widget by project links")
            return { message: 'Could not find widget by project links' }
          }
        } 
      catch (error) {
          console.log(error)
          throw new Error("An error occured. Please try again.")
      }
    }),

    getAll: jest.fn().mockImplementation(async () => {
      try {
          const allWidgets = await prisma.widget.findMany({})
          if (allWidgets) {
            return allWidgets
          }
          else {
            console.log("Could not get all the widgets")
            return { message: 'Could not get all the widgets' }
          }
        } 
        catch (error) {
          console.log(`Error Occured, ${error}`);
          throw new Error("Error getting all widgets.")
        }
    }),

    update: jest.fn().mockImplementation(async (id: string, updateWidgetDto: any) => {
      try {
          const widget = await prisma.widget.findFirst({
            where: { id: id },
          })
          if (widget) {
            const result = await prisma.widget.update({
              where: { id: id },
              data: updateWidgetDto,
            })
            if (result) {
              return { message: "Updated Successfully" };
            } 
            else {
              return { message: "Unable to update widget" };
            }
          }
          else {
            console.log('Unable to find widget by id')
            return { message: 'Unable to find widget' }
          }
        } 
        catch (error) {
          console.log(error)
          throw new Error("An error occured. Please try again.")
        }
    }),

    delete: jest.fn().mockImplementation(async (id: string) => {
      try {
          const result = await prisma.widget.delete({
            where: { id: id },
          });
          if (result) {
            return { message: "Deleted Successfully" };
          } 
          else {
            return { message: "Unable to delete widget" };
          }
        } 
      catch (error) {
          console.log(error)
          throw new Error("An error occured. Please try again.")
      }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WidgetsController],
      providers: [
        WidgetsService,
        PrismaService
      ],
    })
    .overrideProvider(WidgetsService)
    .useValue(mockWidgetsService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<WidgetsController>(WidgetsController);
  });
 
  it("should be defined", () => {
    expect(controller).toBeDefined();
  })

  it("should define a function to create a user", () => {
    expect(controller.create).toBeDefined()
  })

  let widget: any
  it("should create a widget", async () => {
    const createdWidget = await controller.create(createWidgetDto)
    console.log('createdWidget', createdWidget)
    widget = createdWidget
    expect(createdWidget).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      images: expect.any(Array),
      nfts: expect.any(Array),
      project_links: expect.any(Array),
      userId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it("should define a function to get a user by the id", () => {
    expect(controller.getWidgetById).toBeDefined()
  })

  it("should get a widget by id", async () => {
    const widgetById = await controller.getWidgetById(widget.id)
    expect(widgetById).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      images: expect.any(Array),
      nfts: expect.any(Array),
      project_links: expect.any(Array),
      userId: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it("should define a function to get a user from the images", () => {
      expect(controller.getWidgetFromImage).toBeDefined()
    })
  
  it("should get a widget from images", async () => {
      const widgetFromImages = await controller.getWidgetFromImage(widget.image)
      console.log('widgetFromImages', widgetFromImages)
      // expect(widgetFromImages).toEqual({
          
      // })
  })

  it("should define a function to get a user from the NFT Metadata", () => {
      expect(controller.getWidgetFromNFTMetadata).toBeDefined()
    })
  
  it("should get a widget from NFT Metadata", async () => {
      const widgetFromNftMetadata = await controller.getWidgetFromNFTMetadata(widget.nfts)
      console.log('widgetFromNfts', widgetFromNftMetadata)
      // expect(widgetFromNfts).toEqual({
          
      // })
  })

  it("should define a function to get a user from project link", () => {
      expect(controller.getWidgetFromProjectLink).toBeDefined()
    })
  
  it("should get a widget from project links", async () => {
      const widgetFromProjectLinks = await controller.getWidgetFromProjectLink(widget.project_links)
      console.log('widgetFromProjectLinks', widgetFromProjectLinks)
      // expect(widgetFromNfts).toEqual({
          
      // })
  })

  it("should define a function to get all the users", () => {
    expect(controller.getAll).toBeDefined()
  })

  it("should get all the users", async () => {
    const allUsers = await controller.getAll()
    expect(allUsers).toEqual(
      expect.any(Array)
    )
  })

  it("should define a function to update a widget", () => {
    expect(controller.update).toBeDefined()
  })

  it("should update a widget", async () => {
    const updatedWidget = await controller.update(widget.id, updateWidgetDto)
    expect(updatedWidget).toEqual(
      { message: "Updated Successfully" }
    )
  })

  it("should delete a widget by id", async () => {
    const deletedWidget = await controller.delete(widget.id)
    expect(deletedWidget).toEqual(
      { message: "Deleted Successfully" }
    )
  })
})
