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
      console.log(error)
      throw new Error("An error occured, please try again.")
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
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async globalSearchLocationByDistance(userId: string, distance: any, text: string) {
    try {
      const filteredLocation = [];
      const locations = await this.findmatchingLocation(text);
      console.log("locations", locations);
      if (locations) {
        for (let i = 0; i < locations.length; i++) {
          const element = locations[i];
          const locationId = element.id;
          const data = { locationId, distance };
          const result = await this.findLocationDistance(userId, data);
          console.log("location", result);

          if (result) {
            filteredLocation.push(element);
          }
          console.log("filteredLocation", filteredLocation);
        }

        return filteredLocation;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async globalSearchLocationByDistanceWithoutText(userId: string, distance: any) {
    try {
      const filteredLocation = [];
      const locations = await this.locationService.findAll();
      console.log("locations", locations);
      if (locations) {
        for (let i = 0; i < locations.length; i++) {
          const element = locations[i];
          const locationId = element.id;
          const data = { locationId, distance };
          const result = await this.findLocationDistance(userId, data);
          console.log("location", result);

          if (result) {
            filteredLocation.push(element);
          }
          console.log("filteredLocation", filteredLocation);
        }

        return filteredLocation;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async globalSearchPostByDistance(userId: string, distance: any, text: string) {
    try {
      const filteredPost = [];
      const posts = await this.findmatchingPost(text);
      console.log("posts", posts);
      if (posts) {
        for (let i = 0; i < posts.length; i++) {
          const element = posts[i];
          const postId = element.id;
          const data = { postId, distance };
          const result = await this.findPostDistance(userId, data);
          console.log("post", result);

          if (result) {
            filteredPost.push(element);
          }
          console.log("filteredPost", filteredPost);
        }

        return filteredPost;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async globalSearchUserByDistance(userId: string, distance: any, text: string) {
    try {
      const filteredUser = [];
      const users = await this.findmatchingUser(text);
      console.log("result", users);
      if (users) {
        for (let i = 0; i < users.length; i++) {
          const element = users[i];
          const newUserId = element.id;
          const data = { newUserId, distance };
          const result = await this.findUserDistance(userId, data);
          console.log("result", result);

          if (result) {
            filteredUser.push(element);
          }
          console.log("filteredUser", filteredUser);
        }

        return filteredUser;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async globalSearchGroupByDistance(userId: string, distance: any, text: string) {
    try {
      const filteredGroup = [];
      const groups = await this.findmatchingGroup(text);
      console.log("groups", groups);
      if (groups) {
        for (let i = 0; i < groups.length; i++) {
          const element = groups[i];
          const newUserId = element.id;
          const data = { newUserId, distance };
          const result = await this.findUserDistance(userId, data);
          console.log("result", result);

          if (result) {
            filteredGroup.push(element);
          }
          console.log("filteredGroup", filteredGroup);
        }

        return filteredGroup;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
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
      console.log(error)
      throw new Error("An error occured, please try again.")
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
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async findmatchingPost(text: string) {
    try {
      const post = await this.prismaService.post.findMany({
        where: { title: text },
        include: { location: true },
      });

      if (post.length === 0 || post.length > 0) {
        return post;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
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
      console.log('group', group)
      if (group.length === 0 || group.length > 0) {
        return group;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async findUserDistance(myuserId: string, data: any) {
    try {
      const myUser = await this.userService.getUserFromId(myuserId);
      const otherUser = await this.userService.getUserFromId(data.userId);
      console.log("otherUser", otherUser);
      console.log("myUser", myUser);
      if (!myUser || !otherUser) {
        return false
      }
      if (!myUser.location || !otherUser.location)
        return false;

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
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }


  async findLocationDistance(userId: string, data: any) {
    try {
      const user = await this.userService.getUserFromId(userId);
      const location = await this.locationService.findOne(data.postId);
      console.log("location", location);
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
        const message = "location exists inside the distance";
        return message;
      }
      else if (data.distance > calculatedDistance) {
        const message = "location exists inside the distance";
        return message;
      }
      else {
        return false;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async findPostDistance(userId: string, data: any) {
    try {
      const user = await this.userService.getUserFromId(userId);
      const post = await this.postsService.findOne(data.postId);
      console.log("post", post);
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
        const message = "post exists inside the distance";
        return message;
      }
      else if (data.distance > calculatedDistance) {
        const message = "post exists inside the distance";
        return message;
      }
      else {
        return false;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }

  async findGroupDistance(userId: string, data: any) {
    try {
      const user = await this.userService.getUserFromId(userId);
      const group = await this.groupsService.findOne(data.groupId);
      console.log("group", group);
      if (!user || !group) {
        return false
      }
      const a = {
        latitude: user.location[0].latitude,
        longitude: user.location[0].langitude,
      };

      const b = {
        // @ts-ignore
        latitude: group.location[0].latitude,
        // @ts-ignore
        longitude: group.location[0].langitude,
      };

      const calculatedDistance = this.locationService.getDistanceUsingHaversine(
        a,
        b
      );
      if (calculatedDistance === data.distance) {
        const message = "group exists inside the distance";
        return message;
      }
      else if (data.distance > calculatedDistance) {
        const message = "group exists inside the distance";
        return message;
      }
      else {
        return false;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }
}
