import { BadRequestException, Injectable } from "@nestjs/common";
import { LocationsService } from "src/models/locations/locations.service";
import { PostsService } from "src/models/posts/posts.service";
import { UsersService } from "src/models/users/users.service";
import { GroupsService } from "src/models/groups/groups.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateGlobalSearchDto } from "./dto/create-global-search.dto";
import { UpdateGlobalSearchDto } from "./dto/update-global-search.dto";

@Injectable()
export class GlobalSearchService {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
    private locationService: LocationsService,
    private postsService: PostsService,
    private groupsService: GroupsService
  ) { }

  async globalSearch(text: string) {
    try {
      const users = await this.findmatchingUser(text);
      const posts = await this.findmatchingPost(text);
      const locations = await this.findmatchingLocation(text);
      const groups = await this.findmatchingGroup(text);
      return { users, posts, locations, groups };
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async globalSearchByDistance(userId: string, distance: any, text: string) {
    try {
      const users = await this.globalSearchUserByDistance(userId, distance, text);
      const posts = await this.globalSearchPostByDistance(userId, distance, text);
      const locations = await this.globalSearchLocationByDistance(userId, distance, text);
      const groups = await this.globalSearchGroupByDistance(userId, distance, text)
      return { users, posts, locations, groups };
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async globalSearchLocationByDistance(userId: string, distance: any, text: string) {
    try {
      const filteredLocation = [];
      const locations = await this.findmatchingLocation(text);
      if (locations) {
        for (let i = 0; i < locations.length; i++) {
          const element = locations[i]
          const locationId = element.id
          const data = { locationId, distance }
          const result = await this.findLocationDistance(userId, data)

          if (result) {
            filteredLocation.push(element)
          }
        }

        return filteredLocation
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async globalSearchLocationByDistanceWithoutText(userId: string, distance: any) {
    try {
      const filteredLocation = []
      const locations = await this.locationService.findAll()
      if (locations) {
        for (let i = 0; i < locations.length; i++) {
          const element = locations[i]
          const locationId = element.id
          const data = { locationId, distance }
          const result = await this.findLocationDistance(userId, data)

          if (result) {
            filteredLocation.push(element)
          }
        }

        return filteredLocation
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async globalSearchPostByDistance(userId: string, distance: any, text: string) {
    try {
      const filteredPost = [];
      const posts = await this.findmatchingPost(text);
      if (posts) {
        for (let i = 0; i < posts.length; i++) {
          const element = posts[i]
          const postId = element.id
          const data = { postId, distance }
          const result = await this.findPostDistance(userId, data)

          if (result) {
            filteredPost.push(element)
          }
        }

        return filteredPost
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async globalSearchUserByDistance(userId: string, distance: any, text: string) {
    try {
      const filteredUser = []
      const users = await this.findmatchingUser(text)
      if (users) {
        for (let i = 0; i < users.length; i++) {
          const element = users[i]
          const newUserId = element.id;
          const data = { newUserId, distance }
          const result = await this.findUserDistance(userId, data)

          if (result) {
            filteredUser.push(element)
          }
        }

        return filteredUser
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async globalSearchGroupByDistance(userId: string, distance: any, text: string) {
    try {
      const filteredGroup = [];
      const groups = await this.findmatchingGroup(text);
      if (groups) {
        for (let i = 0; i < groups.length; i++) {
          const element = groups[i]
          const newUserId = element.id;
          const data = { newUserId, distance }
          const result = await this.findUserDistance(userId, data)

          if (result) {
            filteredGroup.push(element)
          }
        }

        return filteredGroup
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findmatchingLocation(text: string) {
    try {
      const location = await this.prismaService.location.findMany({
        where: {
          address: {contains: text}
        },
        include: {
          post: true,
          user: true,
        },
      });

      if (location.length === 0 || location.length > 0) {
        return location;
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findmatchingUser(text: string) {
    try {
      const user = await this.prismaService.user.findMany({
        where: {
          OR: [
            {
              firstName: text,
            },
            {
              lastName: text,
            },
            {
              email: text,
            },
            {
              bio: text,
            },
          ],
        },
        include: { location: true },
      });

      if (user.length === 0 || user.length > 0) {
        return user;
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findmatchingPost(text: string) {
    try {
      const post = await this.prismaService.post.findMany({
        where: { title: text },
        include: { location: true },
      })

      if (post.length === 0 || post.length > 0) {
        return post
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }


  async findmatchingGroup(text: string) {
    try {
      const group = await this.prismaService.group.findMany({
        where: {
          OR: [
            {
              name: text,
            },
            {
              description: text,
            },
          ]
        },
        include: { members: true, location: true },
      })
      if (group.length === 0 || group.length > 0) {
        return group;
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findUserDistance(myuserId: string, data: any) {
    try {
      const myUser = await this.userService.getUserFromId(myuserId);
      const otherUser = await this.userService.getUserFromId(data.userId);
      if (!myUser || !otherUser) {
        return false
      }
      if (!myUser.location || !otherUser.location)
        return false

      const a = {
        latitude: myUser.location.latitude,
        longitude: myUser.location.langitude,
      };

      const b = {
        latitude: otherUser.location.latitude,
        longitude: otherUser.location.langitude,
      };

      const calculatedDistance =
        this.locationService.getDistanceUsingHaversine(a, b);
      console.log("calculatedDistance", calculatedDistance);

      if (calculatedDistance === 0 || calculatedDistance === data.distance || calculatedDistance < data.distance)
        return true;
      return false;
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }


  async findLocationDistance(userId: string, data: any) {
    try {
      const user = await this.userService.getUserFromId(userId);
      const location = await this.locationService.findOne(data.postId);
      if (!user || !location) {
        return false
      }
      const a = {
        latitude: user.location.latitude,
        longitude: user.location.langitude,
      };

      const b = {
        latitude: location.latitude,
        longitude: location.langitude,
      };

      const calculatedDistance = this.locationService.getDistanceUsingHaversine(
        a,
        b
      );
      if (calculatedDistance === data.distance) {
        const message = "location exists inside the distance"
        return message;
      }
      else if (data.distance > calculatedDistance) {
        const message = "location exists inside the distance"
        return message
      }
      else {
        return false
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findPostDistance(userId: string, data: any) {
    try {
      const user = await this.userService.getUserFromId(userId)
      const post = await this.postsService.findOne(data.postId)
      if (!user || !post) {
        return false
      }
      const a = {
        latitude: user.location[0].latitude,
        longitude: user.location[0].langitude,
      };

      const b = {
        latitude: post.location[0].latitude,
        longitude: post.location[0].langitude,
      };

      const calculatedDistance = this.locationService.getDistanceUsingHaversine(
        a,
        b
      );
      if (calculatedDistance === data.distance) {
        const message = "post exists inside the distance"
        return message
      }
      else if (data.distance > calculatedDistance) {
        const message = "post exists inside the distance"
        return message
      }
      else {
        return false
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async findGroupDistance(userId: string, data: any) {
    try {
      const user = await this.userService.getUserFromId(userId)
      const group = await this.groupsService.findOne(data.groupId)
      if (!user || !group) {
        return false
      }
      const a = {
        latitude: user.location[0].latitude,
        longitude: user.location[0].langitude,
      }

      const b = {
        // @ts-ignore
        latitude: group.location[0].latitude,
        // @ts-ignore
        longitude: group.location[0].langitude,
      }

      const calculatedDistance = this.locationService.getDistanceUsingHaversine(
        a,
        b
      )
      if (calculatedDistance === data.distance) {
        const message = "group exists inside the distance"
        return message
      }
      else if (data.distance > calculatedDistance) {
        const message = "group exists inside the distance"
        return message
      }
      else {
        return false
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }
}
