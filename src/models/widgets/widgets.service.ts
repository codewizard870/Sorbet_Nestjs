import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
  } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateWidgetDto } from "./dto/create-widgets-dto";
import { UpdateWidgetDto } from "./dto/update-widgets-dto";

  
  @Injectable()
  export class WidgetsService {
    constructor(
      private prisma: PrismaService,
    ) {}
  
    async create(data: any) {
      try {
          const user = this.prisma.user.findFirst({
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

          const result = await this.prisma.widget.create({
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
    }

    async getWidgetById(id: string) {
        try {
            const widgetById = await this.prisma.widget.findFirst({
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
    }

    async getWidgetsByUserId(userId: string) {
      try {
          const widgets = await this.prisma.widget.findMany({
              where: { userId: userId }
          })
          if (widgets) {
              return widgets
          }
          else {
              console.log('Could not find widgets by userId')
              return { message: 'Could not find widgets by userId' }
          }
      } 
      catch (error) {
          console.log(error)
          throw new Error("An error occured. Please try again.")
      }
    }

    async getWidgetFromImage(image: string) {
        try {
            const result = await this.prisma.widget.findFirst({
              where: {image: image},
            })
            if (result) {  
              return result
            }
            else {
              console.log("Could not find widget by image")
              return { message: 'Could not find widget by image' }
            }
          } 
        catch (error) {
            console.log(error)
            throw new Error("An error occured. Please try again.")
        }
    }

    async getWidgetFromNFTMetadata(nft_metadata: string) {
        try {
            const result = await this.prisma.widget.findFirst({
              where: {nft_metadata: nft_metadata},
            })
            if (result) {  
              return result
            }
            else {
              console.log("Could not find widget by nft metadata")
              return { message: 'Could not find widget by nft metadata' }
            }
          } 
        catch (error) {
            console.log(error)
            throw new Error("An error occured. Please try again.")
        }
    }

    async getWidgetFromProjectLink(project_link: string) {
        try {
            const result = await this.prisma.widget.findFirst({
              where: {project_link: project_link},
            })
            if (result) {  
              return result
            }
            else {
              console.log("Could not find widget by project link")
              return { message: 'Could not find widget by project link' }
            }
          } 
        catch (error) {
            console.log(error)
            throw new Error("An error occured. Please try again.")
        }
    }
  
    async getAll() {
      try {
        const allWidgets = await this.prisma.widget.findMany({})
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
    }
  
    async update(id: string, updateWidgetDto: any) {
      try {
          const widget = await this.prisma.widget.findFirst({
            where: { id: id },
          })
          if (widget) {
            const result = await this.prisma.widget.update({
              where: { id: id },
              data: updateWidgetDto,
            })
            if (result) {
              return { message: "Update Successfully" };
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
    }
  
    async delete(id: string) {
      try {
        const result = await this.prisma.widget.delete({
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
    }
  }
  