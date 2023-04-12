import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
  } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import axios from "axios";
import { CreateWidgetDto } from "./dto/create-widgets-dto";
import { UpdateWidgetDto } from "./dto/update-widgets-dto";
import cheerio from 'cheerio';

const DRIBBLE_CLIENT_ID = process.env.DRIBBLE_CLIENT_ID
const DRIBBLE_CLIENT_SECRET = process.env.DRIBBLE_CLIENT_SECRET

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET
  
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
              nftMetadata: data.nftMetadata,
              oauthToken: data.oauthToken,
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

    async deleteByIndex(userId: string, widgetIndex: string) {
      try {
        const user = await this.prisma.user.findFirst({
          where: { id: userId },
          include: { widgets: true }
        })
        if (user) {
          const index = parseInt(widgetIndex)
          const targetWidget = user.widgets[index]
          const targetWidgetId = targetWidget.id
          const result = await this.prisma.widget.delete({
            where: { id: targetWidgetId }
          })
          if (result) {
            return { message: "Deleted Successfully" };
          } 
          else {
            return { message: "Unable to delete widget" };
          }
        }
        else {
          console.log('Error finding user my id')
          throw new Error('Error finding user by id')
        }
      } 
      catch (error) {
        console.error(error)
        throw new Error("An error occured. Please try again.")
      }
    }

    async getSoundcloudTrackId(soundcloudUrl: string) {
      try {
        const { data } = await axios.get(soundcloudUrl);
        const $ = cheerio.load(data);
        const audioUrl = $('meta[property="al:ios:url"]')
        const content = audioUrl.attr('content');
        const trackId = content.split(':')[2]
  
        if (trackId) {
          return trackId
        }
      } 
      catch (error) {
        console.error(error)
      }
    }

    async createDribbbleAccessToken(dribbbleCode: string) {
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
        return data.access_token
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }

    async createGithubAccessToken(githubCode: string) {
      try {
        const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${githubCode}`, {
          mode: 'no-cors',
          method: 'POST',
          headers: {
              'Accept': 'application/json'
          },
          body: JSON.stringify(null),
      })
    
        const data = await response.json()
        console.log('createGithubAccessToken data', data)
        return data.access_token
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured. Please try again.")
      }
    }

    async createSpotifyAccessToken(spotifyCode: string, redirect_uri?: string) {
      try {
        const url = 'https://accounts.spotify.com/api/token';
        const data = new URLSearchParams({
          'grant_type': 'authorization_code',
          'code': spotifyCode,
          'redirect_uri': redirect_uri,
        });
        const config = {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
        const response = await axios.post(url, data, config);
        return response.data;
      }
      catch (error) {
        console.error(error)
        throw new Error("An error occured. Please try again.")
      }
    }

    async createInstagramAccessToken(instagramCode: string, redirect_uri?: string) {
      try {
        const url = 'https://api.instagram.com/oauth/access_token';
        const data = new URLSearchParams({
          'client_id': INSTAGRAM_CLIENT_ID,
          'client_secret': INSTAGRAM_CLIENT_SECRET,
          'code': instagramCode,
          'grant_type': 'authorization_code',
          'redirect_uri': redirect_uri
        });
        const response = await axios.post(url, data);
        console.log('response', response);
        console.log('data', response.data);
        return response.data;
      }
      catch (error) {
        console.error(error)
        throw new Error("An error occured. Please try again.")
      }
    }
  }
  