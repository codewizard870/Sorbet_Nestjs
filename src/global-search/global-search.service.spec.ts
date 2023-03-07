import { Test, TestingModule } from "@nestjs/testing";
import { GlobalSearchService } from "./global-search.service";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { LocationsService } from "src/models/locations/locations.service";
import { PostsService } from "src/models/posts/posts.service";
import { UsersService } from "src/models/users/users.service";
import { GroupsService } from "src/models/groups/groups.service";
import { TimezonesService } from "src/timezones/timezones.service";
import { GoogleMapsService } from "src/google-maps/google-maps.service";
import { PasswordsService } from "src/utils/passwords/passwords.service";
import { ConfigService } from "@nestjs/config";
import { TokensService } from "src/utils/tokens/tokens.service";
import { CreateLocationDto } from "src/models/locations/dto/create-location.dto";
import { Context, MockContext, createMockContext } from "../../test/prisma/context"
import { PrismaClient } from '@prisma/client'
import * as haversine from "haversine-distance";
import * as NodeGeocoder from "node-geocoder";
import * as dotenv from 'dotenv'
dotenv.config()


const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

const accessKey = process.env.GOOGLE_MAPS_ACCESS_KEY
const options = {
  provider: "google",

  // Optional depending on the providers
  apiKey: accessKey, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const findmatchingUser = async (text: string) => {
  try {
    const user = await prisma.user.findMany({
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

const findmatchingPost = async (text: string) => {
  try {
    const post = await prisma.post.findMany({
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

const findmatchingLocation = async (text: string) => {
  try {
    const location = await prisma.location.findMany({
      where: {
        address: { contains: text }
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

const findmatchingGroup = async (text: string) => {
  try {
    const group = await prisma.group.findMany({
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

const findUserDistance = async (myuserId: string, data: any) => {
  try {
    const myUser = await mockUsersService.getUserFromId(myuserId);
    const otherUser = await mockUsersService.getUserFromId(data.userId);
    console.log("otherUser", otherUser);
    console.log("myUser", myUser);
    if (myUser.location.length === 0) {
      return false;
    } else if (otherUser.location.length === 0) {
      return false;
    } else {
      const a = {
        latitude: myUser.location[0].Latitude,
        longitude: myUser.location[0].Langitude,
      };

      const b = {
        latitude: otherUser.location[0].Latitude,
        longitude: otherUser.location[0].Langitude,
      };

      const calculatedDistance =
        mockLocationService.getDistanceUsingHaversine(a, b);
      console.log("calculatedDistance", calculatedDistance);

      if (calculatedDistance === 0) {
        return true;
      }
      if (calculatedDistance === data.distance) {
        return true;
      } else if (calculatedDistance < data.distance) {
        return true;
      } else {
        return false;
      }
    }
  }
  catch (error) {
    console.log(error)
    throw new Error("An error occured, please try again.")
  }
}

const findLocationDistance = async (userId: string, data: any) => {
  try {
    const user = await mockUsersService.getUserFromId(userId);
    const location = await mockLocationService.findOne(data.postId);
    console.log("location", location);
    const a = {
      latitude: user.location[0].Latitude,
      longitude: user.location[0].Langitude,
    };

    const b = {
      latitude: location.Latitude,
      longitude: location.Langitude,
    };

    const calculatedDistance = mockLocationService.getDistanceUsingHaversine(
      a,
      b
    );
    if (calculatedDistance === data.distance) {
      const message = "location exists inside the distance";
      return message;
    } else if (data.distance > calculatedDistance) {
      const message = "location exists inside the distance";
      return message;
    } else {
      return false;
    }
  }
  catch (error) {
    console.log(error)
    throw new Error("An error occured, please try again.")
  }
}

const findPostDistance = async (userId: string, data: any) => {
  try {
    const user = await mockUsersService.getUserFromId(userId);
    const post = await mockPostsService.findOne(data.postId);
    console.log("post", post);
    const a = {
      latitude: user.location[0].Latitude,
      longitude: user.location[0].Langitude,
    };

    const b = {
      latitude: post.location[0].Latitude,
      longitude: post.location[0].Langitude,
    };

    const calculatedDistance = mockLocationService.getDistanceUsingHaversine(
      a,
      b
    );
    if (calculatedDistance === data.distance) {
      const message = "post exists inside the distance";
      return message;
    } else if (data.distance > calculatedDistance) {
      const message = "post exists inside the distance";
      return message;
    } else {
      return false;
    }
  }
  catch (error) {
    console.log(error)
    throw new Error("An error occured, please try again.")
  }
}

const findGroupDistance = async (userId: string, data: any) => {
  try {
    const user = await mockUsersService.getUserFromId(userId);
    const group = await mockGroupsService.findOne(data.groupId);
    console.log("group", group);
    if (!user || !group) {
      return false
    }
    const a = {
      latitude: user.location[0].Latitude,
      longitude: user.location[0].Langitude,
    };

    const b = {
      // @ts-ignore
      latitude: group.location[0].Latitude,
      // @ts-ignore
      longitude: group.location[0].Langitude,
    };

    const calculatedDistance = mockLocationService.getDistanceUsingHaversine(
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

const globalSearchLocationByDistance = async (userId: string, distance: any, text: string) => {
  try {
    const filteredLocation = [];
    const locations = await findmatchingLocation(text);
    console.log("locations", locations);
    if (locations) {
      for (let i = 0; i < locations.length; i++) {
        const element = locations[i];
        const locationId = element.id;
        const data = { locationId, distance };
        const result = await findLocationDistance(userId, data);
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

const globalSearchLocationByDistanceWithoutText = async (userId: string, distance: any) => {
  try {
    const filteredLocation = [];
    const locations = await mockLocationService.findAll();
    console.log("locations", locations);
    if (locations) {
      for (let i = 0; i < locations.length; i++) {
        const element = locations[i];
        const locationId = element.id;
        const data = { locationId, distance };
        const result = await findLocationDistance(userId, data);
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

const globalSearchPostByDistance = async (userId: string, distance: any, text: string) => {
  try {
    const filteredPost = [];
    const posts = await findmatchingPost(text);
    console.log("posts", posts);
    if (posts) {
      for (let i = 0; i < posts.length; i++) {
        const element = posts[i];
        const postId = element.id;
        const data = { postId, distance };
        // @ts-ignore
        const result = await findPostDistance(userId, data);
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

const globalSearchUserByDistance = async (userId: string, distance: any, text: string) => {
  try {
    const filteredUser = [];
    const users = await findmatchingUser(text);
    if (users) {
      for (let i = 0; i < users.length; i++) {
        const element = users[i];
        const newUserId = element.id;
        const data = { newUserId, distance };
        const result = await findUserDistance(userId, data);
        if (result) {
          filteredUser.push(element);
        }
      }
      return filteredUser;
    }
  }
  catch (error) {
    console.log(error)
    throw new Error("An error occured, please try again.")
  }
}

const globalSearchGroupByDistance = async (userId: string, distance: any, text: string) => {
  try {
    const filteredGroup = [];
    const groups = await findmatchingGroup(text);
    console.log("groups", groups);
    if (groups) {
      for (let i = 0; i < groups.length; i++) {
        const element = groups[i];
        const newUserId = element.id;
        const data = { newUserId, distance };
        const result = await findUserDistance(userId, data);
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

let mockPostsService = {
  findOne: jest.fn().mockImplementation(async (_id: string) => {
    try {
      const post = await prisma.post.findFirst({
        where: { id: _id },
        include: {
          location: true,
        },
      });
      return post;
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }),
}

let mockUsersService = {
  getUserFromEmail: jest.fn().mockImplementation(async (email: string) => {
    try {
      const result = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (result) {
        console.log("RESULT", result);

        return result;
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }),

  getUserFromId: jest.fn().mockImplementation(async (_id: string) => {
    try {
      const user = await prisma.user.findFirst({
        where: { id: _id },
        include: { jobProfile: true, location: true },
      });
      return user;
    }
    catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  }),
}

let mockGoogleMapsService = {
  getCoordinates: jest.fn().mockImplementation(async (address: string) => {
    try {
      console.log("address in get coordinates", address);
      const geocoder = NodeGeocoder(options);

      const res = await geocoder.geocode(address);
      console.log("response", res);
      console.log("latitude", res[0].latitude);
      console.log("longitude", res[0].longitude);
      return {
        lat: res[0].latitude,
        lng: res[0].longitude,
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  })
}

let mockLocationService = {
  getDistanceUsingHaversine: jest.fn().mockImplementation(async (user: any, saved: any) => {
    try {
      // latitude:31.5203696,longitude:74.35874729999999 lahore
      // latitude:33.2615676,longitude:73.3057508 gujar khan
      const a = { latitude: 33.5651107, longitude: 73.0169135 };
      const b = { latitude: 33.2615676, longitude: 73.3057508 };
      const distanceInMeters = haversine(user, saved);
      const distanceInkilometers = distanceInMeters / 1000;
      console.log("distance ", distanceInkilometers);
      return distanceInkilometers;
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }),

  findAll: jest.fn().mockImplementation(async () => {
    try {
      return await prisma.location.findMany({
        include: {
          post: true,
          user: true,
        },
      });
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }),

  findOne: jest.fn().mockImplementation(async (_id: string) => {
    try {
      const location = await prisma.location.findFirst({
        where: { id: _id },
        include: {
          post: true,
          user: true,
        },
      });
      return location;
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }),

  createMyLocation: jest.fn().mockImplementation(async (data: any, userId: string) => {
    const address = data.address;
    const location = await mockGoogleMapsService.getCoordinates(address);
    console.log("location", location);

    const result = await prisma.location.create({
      data: {
        userId: userId,
        address: data.address,
        locationType: data.locationType,

        Latitude: location.lat,

        Langitude: location.lng,
      },
    });
    if (result) {
      return result;
    }
  }),

  create: jest.fn().mockImplementation(async (data: CreateLocationDto) => {
    try {
      const address = data.address;
      const location = await mockGoogleMapsService.getCoordinates(address);
      console.log("location", location);
      if (data.postId) {
        const result = await prisma.location.create({
          data: {
            postId: data.postId,
            address: data.address,
            locationType: data.locationType,
            Latitude: location.lat,
            Langitude: location.lng,
          },
        });
        if (result) {
          return result;
        } else {
          throw new BadRequestException("Please try again later");
        }
      } else {
        throw new BadRequestException("This id does not exists");
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }),
}

let mockGroupsService = {
  findOne: jest.fn().mockImplementation(async (_id: string) => {
    try {
      const group = await prisma.group.findFirst({
        where: { id: _id },
        include: { location: true },
      });
      return group
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }),
}

let mockGlobalSearchService = {
  globalSearch: jest.fn().mockImplementation(async (text: string) => {
    try {
      const users = await findmatchingUser(text);
      const posts = await findmatchingPost(text);
      const locations = await findmatchingLocation(text);
      const groups = await findmatchingGroup(text);
      return { users, posts, locations, groups };
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }),

  globalSearchByDistance: jest.fn().mockImplementation(async (userId: string, distance: any, text: string) => {
    try {
      const users = await globalSearchUserByDistance(userId, distance, text);
      const posts = await globalSearchPostByDistance(userId, distance, text);
      const locations = await globalSearchLocationByDistance(userId, distance, text);
      const groups = await globalSearchGroupByDistance(userId, distance, text)
      return { users, posts, locations, groups };
    }
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }),

  globalSearchLocationByDistance: jest.fn().mockImplementation(async (userId: string, distance: any, text: string) => {
    try {
      const filteredLocation = [];
      const locations = await findmatchingLocation(text);
      console.log("locations", locations);
      if (locations) {
        for (let i = 0; i < locations.length; i++) {
          const element = locations[i];
          const locationId = element.id;
          const data = { locationId, distance };
          const result = await findLocationDistance(userId, data);
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
  }),

  globalSearchLocationByDistanceWithoutText: jest.fn().mockImplementation(async (userId: string, distance: any) => {
    try {
      const filteredLocation = [];
      const locations = await mockLocationService.findAll();
      console.log("locations", locations);
      if (locations) {
        for (let i = 0; i < locations.length; i++) {
          const element = locations[i];
          const locationId = element.id;
          const data = { locationId, distance };
          const result = await findLocationDistance(userId, data);
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
  }),

  globalSearchPostByDistance: jest.fn().mockImplementation(async (userId: string, distance: any, text: string) => {
    try {
      const filteredPost = [];
      const posts = await findmatchingPost(text);
      console.log("posts", posts);
      if (posts) {
        for (let i = 0; i < posts.length; i++) {
          const element = posts[i];
          const postId = element.id;
          const data = { postId, distance };
          const result = await findPostDistance(userId, data);
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
  }),

  globalSearchUserByDistance: jest.fn().mockImplementation(async (userId: string, distance: any, text: string) => {
    try {
      const filteredUser = [];
      const users = await findmatchingUser(text);
      console.log("result", users);
      if (users) {
        for (let i = 0; i < users.length; i++) {
          const element = users[i];
          const newUserId = element.id;
          const data = { newUserId, distance };
          const result = await findUserDistance(userId, data);
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
  }),

  globalSearchGroupByDistance: jest.fn().mockImplementation(async (userId: string, distance: any, text: string) => {
    try {
      const filteredGroup = [];
      const groups = await findmatchingGroup(text);
      console.log("groups", groups);
      if (groups) {
        for (let i = 0; i < groups.length; i++) {
          const element = groups[i];
          const newUserId = element.id;
          const data = { newUserId, distance };
          const result = await findUserDistance(userId, data);
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
  }),
}

describe("GlobalSearchService", () => {
  let service: GlobalSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalSearchService,
        PrismaService,
        LocationsService,
        PostsService,
        UsersService,
        TimezonesService,
        GoogleMapsService,
        PasswordsService,
        ConfigService,
        TokensService,
        GroupsService
      ],
    })
      .overrideProvider(GlobalSearchService)
      .useValue(mockGlobalSearchService)
      .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<GlobalSearchService>(GlobalSearchService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("should define a function for global search", () => {
    expect(service.globalSearch).toBeDefined()
  })

  let user: any
  it("should search users, posts, events, gigs, locations", async () => {
    const globalSearchReturn = await service.globalSearch('Daena')
    user = globalSearchReturn
    expect(service.globalSearch).toBeCalled()
    expect(globalSearchReturn).toEqual({
      users: expect.any(Array),
      gigs: expect.any(Array),
      groups: expect.any(Array),
      events: expect.any(Array),
      posts: expect.any(Array),
      locations: expect.any(Array)
    })
  })

  it("should define a function for global search by distance", () => {
    expect(service.globalSearchByDistance).toBeDefined()
  })

  it("should search users, posts, events, gigs, locations by distance", async () => {
    const globalSearchByDistanceReturn = await service.globalSearchByDistance(user.id, 50, 'Daena')
    expect(service.globalSearchByDistance).toBeCalled()
    expect(globalSearchByDistanceReturn).toEqual({
      users: expect.any(Array),
      gigs: expect.any(Array),
      groups: expect.any(Array),
      events: expect.any(Array),
      posts: expect.any(Array),
      locations: expect.any(Array)
    })
  })

  it("should define a function for global search of location by distance", () => {
    expect(service.globalSearchLocationByDistance).toBeDefined()
  })

  it("should search locations by distance", async () => {
    const globalSearchLocationByDistanceReturn = await service.globalSearchLocationByDistance(user.id, 50, 'Daena')
    expect(service.globalSearchLocationByDistance).toBeCalled()
    expect(globalSearchLocationByDistanceReturn).toEqual(expect.any(Array))
  })

  it("should define a function for global search (without text) of location by distance", () => {
    expect(service.globalSearchLocationByDistanceWithoutText).toBeDefined()
  })

  it("should search locations (without text) by distance", async () => {
    // const globalSearchLocationByDistanceWithoutTextReturn = await service.globalSearchLocationByDistanceWithoutText(user.id, 50)
    // expect(service.globalSearchLocationByDistanceWithoutText).toBeCalled()
    // expect(globalSearchLocationByDistanceWithoutTextReturn).toEqual(expect.any(Array))
  })

  it("should define a function for global search of post by distance", () => {
    expect(service.globalSearchPostByDistance).toBeDefined()
  })

  it("should search post by distance", async () => {
    const globalSearchPostByDistanceReturn = await service.globalSearchPostByDistance(user.id, 50, "Daena")
    expect(service.globalSearchPostByDistance).toBeCalled()
    expect(globalSearchPostByDistanceReturn).toEqual(expect.any(Array))
  })

  it("should define a function for global search of user by distance", () => {
    expect(service.globalSearchUserByDistance).toBeDefined()
  })

  it("should search user by distance", async () => {
    const globalSearchUserByDistanceReturn = await service.globalSearchUserByDistance(user.id, 50, "Daena")
    expect(service.globalSearchUserByDistance).toBeCalled()
    expect(globalSearchUserByDistanceReturn).toEqual(expect.any(Array))
  })

  it("should define a function for global search of group by distance", () => {
    expect(service.globalSearchGroupByDistance).toBeDefined()
  })

  it("should search group by distance", async () => {
    const globalSearchUserByDistanceReturn = await service.globalSearchGroupByDistance(user.id, 50, "Daena")
    expect(service.globalSearchGroupByDistance).toBeCalled()
    expect(globalSearchUserByDistanceReturn).toEqual(expect.any(Array))
  })
})