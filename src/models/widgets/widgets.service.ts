import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
  } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateWidgetDto } from "./dto/create-widgets-dto";
import { UpdateWidgetDto } from "./dto/update-widgets-dto";

const DRIBBLE_CLIENT_ID = process.env.DRIBBLE_CLIENT_ID
const DRIBBLE_CLIENT_SECRET = process.env.DRIBBLE_CLIENT_SECRET
  
  @Injectable()
  export class WidgetsService {
    constructor(
      private prisma: PrismaService,
    ) {}
  
    async create(data: any) {
      try {
         const result = await this.prisma.widget.create({
            data: {
              username: data.username,
              url: data.url,
              name: data.name,
              description: data.description,
              type: data.type,
              image: data.image,
              nft_metadata: data.nft_metadata,
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

    async findOne(id: string) {
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

    async findByUserId(userId: string) {
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
  
    async findAll() {
      try {
        const allWidgets = await this.prisma.widget.findMany({
          // include: { user: true }
        })
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

    async findAllByType(type: string) {
      try {
        const widgets = await this.prisma.widget.findMany({
          where: { type: type }
          // include: { user: true }
        })
        if (widgets) {
          return widgets
        }
        else {
          console.log("Could not get all the widgets by type")
          return { message: 'Could not get all the widgets by type' }
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
  
    async remove(id: string) {
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

    async createDribbleAccessToken(dribbbleCode: string) {
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
    }
  }
  