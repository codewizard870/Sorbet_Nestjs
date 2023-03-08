import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { WidgetsService } from "./widgets.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateWidgetDto } from "./dto/create-widgets-dto";
import { UpdateWidgetDto } from "./dto/update-widgets-dto";
import { Context, MockContext, createMockContext } from "../../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import { Service } from "aws-sdk";

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const DRIBBLE_CLIENT_ID = process.env.DRIBBLE_CLIENT_ID
const DRIBBLE_CLIENT_SECRET = process.env.DRIBBLE_CLIENT_SECRET

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
    image: ''
}

describe("WidgetsService", () => {
    let service: WidgetsService;
  
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

      getWidgetFromProjectLink: jest.fn().mockImplementation(async (project_link: string) => {
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

      createDribbleAccessToken: jest.fn().mockImplementation(async (dribbbleCode: string) => {
        try {
          const response = await fetch(`https://dribbble.com/oauth/token?client_id=${DRIBBLE_CLIENT_ID}&client_secret=${DRIBBLE_CLIENT_SECRET}&code=${dribbbleCode}`, {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(null),
        })
      
          const data = await response.json()
          console.log(data)
          return data
        } 
        catch (error) {
          console.log(error)
          throw new Error("An error occured. Please try again.")
        }
      }),
    }
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [WidgetsService, PrismaService],
      })
      .overrideProvider(WidgetsService)
      .useValue(mockWidgetsService)
      .compile()
  
      mockCtx = createMockContext()
      ctx = mockCtx as unknown as Context
      service = module.get<WidgetsService>(WidgetsService);
    });
  
    it("should be defined", () => {
      expect(service).toBeDefined();
    })
  
    it("should define a function to create a user", () => {
      expect(service.create).toBeDefined()
    })
  
    let widget: any
    it("should create a widget", async () => {
      const createdWidget = await service.create(createWidgetDto)
      console.log('createdWidget', createdWidget)
      widget = createdWidget
      expect(service.create).toBeCalled()
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
      expect(service.getWidgetById).toBeDefined()
    })
  
    it("should get a widget by id", async () => {
      const widgetById = await service.getWidgetById(widget.id)
      expect(service.getWidgetById).toBeCalled()
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
        expect(service.getWidgetFromImage).toBeDefined()
      })
    
    it("should get a widget from image", async () => {
        const widgetFromImage = await service.getWidgetFromImage(widget.image)
        console.log('widgetFromImage', widgetFromImage)
        expect(service.getWidgetFromImage).toBeCalled()
        // expect(widgetFromImages).toEqual({
            
        // })
    })

    it("should define a function to get a user from the NFTs", () => {
        expect(service.getWidgetFromNFTMetadata).toBeDefined()
      })
    
    it("should get a widget from NFTs", async () => {
        const widgetFromNftMetadata = await service.getWidgetFromNFTMetadata(widget.nft_metadata)
        console.log('widgetFromNfts', widgetFromNftMetadata)
        expect(service.getWidgetFromNFTMetadata).toBeCalled()
        // expect(widgetFromNfts).toEqual({
            
        // })
    })

    it("should define a function to get a user from the NFTs", () => {
        expect(service.getWidgetFromProjectLink).toBeDefined()
      })
    
    it("should get a widget from project links", async () => {
        const widgetFromProjectLinks = await service.getWidgetFromProjectLink(widget.project_links)
        console.log('widgetFromProjectLinks', widgetFromProjectLinks)
        expect(service.getWidgetFromProjectLink).toBeCalled()
        // expect(widgetFromNfts).toEqual({
            
        // })
    })
  
    it("should define a function to get all the users", () => {
      expect(service.getAll).toBeDefined()
    })
  
    it("should get all the users", async () => {
      const allUsers = await service.getAll()
      expect(service.getAll).toBeCalled()
      expect(allUsers).toEqual(
        expect.any(Array)
      )
    })

    it("should define a function to update a widget", () => {
      expect(service.update).toBeDefined()
    })

    it("should update a widget", async () => {
      const updatedWidget = await service.update(widget.id, updateWidgetDto)
      expect(service.update).toBeCalled()
      expect(updatedWidget).toEqual(
        { message: "Updated Successfully" }
      )
    })
  
    it("should delete a widget by id", async () => {
      const deletedWidget = await service.delete(widget.id)
      expect(service.delete).toBeCalled()
      expect(deletedWidget).toEqual(
        { message: "Deleted Successfully" }
      )
    })

    it("should define a function to create a dribbble access token", () => {
      expect(service.createDribbleAccessToken).toBeDefined()
    })

    it("should create a dribbble access token", async () => {
      const accessToken = await service.createDribbleAccessToken('6d3c680687c401595a705bcf0b45841dde3ec1243187dd77f845aa232657dc94')
      console.log('accessToken', accessToken)
      expect(service.createDribbleAccessToken).toBeCalled()
      // expect(accessToken).toEqual({
        
      // })
    })
  })