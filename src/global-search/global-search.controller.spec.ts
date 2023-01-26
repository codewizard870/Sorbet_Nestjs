import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { GlobalSearchController } from "./global-search.controller";
import { GlobalSearchService } from "./global-search.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { EventsService } from "src/models/events/events.service";
import { GigsService } from "src/models/gigs/gigs.service";
import { LocationsService } from "src/models/locations/locations.service";
import { PostsService } from "src/models/posts/posts.service";
import { UsersService } from "src/models/users/users.service";
import { TimezonesService } from "src/timezones/timezones.service";
import { GoogleMapsService } from "src/google-maps/google-maps.service";
import { PasswordsService } from "src/utils/passwords/passwords.service";
import { ConfigService } from "@nestjs/config";
import { TokensService } from "src/utils/tokens/tokens.service";
import {FindUserDistanceDto, FindEventDistanceDto, FindGigDistanceDto, FindPostDistanceDto} from "./dto/find-distance.dto";
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

const findUserDistanceDto: FindUserDistanceDto = {
  userId: '63cf4ccadfc19cc0f1e335f4',
  distance: 50
}

const findEventDistanceDto: FindEventDistanceDto = {
  eventId: '000102030405060708090a0b',
  distance: 50
}

const findGigDistanceDto: FindGigDistanceDto = {
  gigId: '000102030405060708090a0b',
  distance: 50
}

const findPostDistanceDto: FindPostDistanceDto = {
  postId: '000102030405060708090a0b',
  distance: 50
}

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
      where: { text: text },
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

const findmatchingGig = async (text: string) => {
  try {
    const gig = await prisma.gig.findMany({
      where: {
        OR: [
          {
            title: text,
          },
          {
            description: text,
          },

          {
            tags: {
              has: text,
            },
          },
        ],
      },
      include: { location: true },
    });

    if (gig.length === 0 || gig.length > 0) {
      return gig;
    } 
  } 
  catch (error) {
    console.log(error)
    throw new Error("An error occured, please try again.")
  }
}

const findmatchingEvent = async (text: string) => {
  try {
    const event = await prisma.event.findMany({
      where: {
        OR: [
          {
            description: text,
          },
          {
            name: text,
          },
        ],
      },
      include: { location: true },
    });
    console.log("event", event);
    if (event.length === 0 || event.length > 0) {
      return event;
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
        OR: [
          {
            country: text,
          },
          {
            province: text,
          },
          {
            district: text,
          },
          {
            city: text,
          },
        ],
      },
      include: {
        post: true,
        user: true,
        event: true,
        gig: true,
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

const findEventDistance = async (userId: string, data: any) => {
  try {
    const user = await mockUsersService.getUserFromId(userId);
    const event = await mockEventsService.findOne(data.eventId);
    console.log("event", event);
    const a = {
      latitude: user.location[0].Latitude,
      longitude: user.location[0].Langitude,
    };

    const b = {
      latitude: event.location[0].Latitude,
      longitude: event.location[0].Langitude,
    };

    const calculatedDistance = mockLocationService.getDistanceUsingHaversine(
      a,
      b
    );
    if (calculatedDistance === data.distance) {
      const message = "event exists inside the distance";
      return message;
    } else if (data.distance > calculatedDistance) {
      const message = "event exists inside the distance";
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

const findGigDistance = async (userId: string, data: any) => {
  try {
    const user = await mockUsersService.getUserFromId(userId);
    const gig = await mockGigsService.findOne(data.gigId);
    console.log("gig", gig);
    const a = {
      latitude: user.location[0].Latitude,
      longitude: user.location[0].Langitude,
    };

    const b = {
      latitude: gig.location[0].Latitude,
      longitude: gig.location[0].Langitude,
    };

    const calculatedDistance = mockLocationService.getDistanceUsingHaversine(
      a,
      b
    );
    if (calculatedDistance === data.distance) {
      const message = "event exists inside the distance";
      return message;
    } else if (data.distance > calculatedDistance) {
      const message = "event exists inside the distance";
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

const globalSearchGigByDistance = async (userId: string, distance: any, text: string) => {
  try {
    const filteredGig = [];
    const gigs = await findmatchingGig(text);
    console.log("gigs", gigs);
    if (gigs) {
      for (let i = 0; i < gigs.length; i++) {
        const element = gigs[i];
        const gigId = element.id;
        const data = { gigId, distance };
        const result = await findGigDistance(userId, data);
        console.log("gig", result);

        if (result) {
          filteredGig.push(element);
        }
        console.log("filteredGig", filteredGig);
      }

      return filteredGig;
    } 
  } 
  catch (error) {
    console.log(error)
    throw new Error("An error occured, please try again.")
  }
}

const globalSearchEventByDistance = async (userId: string, distance: any, text: string) => {
  try {
    const filteredEvent = [];
    const events = await findmatchingEvent(text);
    console.log("events", events);
    if (events) {
      for (let i = 0; i < events.length; i++) {
        const element = events[i];
        const eventId = element.id;
        const data = { eventId, distance };
        const result = await findEventDistance(userId, data);
        console.log("post", result);

        if (result) {
          filteredEvent.push(element);
        }
        console.log("filteredEvent", filteredEvent);
      }

      return filteredEvent;
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

let mockPostsService = {
  findOne: jest.fn().mockImplementation(async (_id: string) => {
    try {
      const post = await prisma.post.findFirst({
        where: { id: _id },
        include: {
          blob: true,
          location: true,
          gig: true,
          event: true,
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

let mockGigsService = {
  findOne: jest.fn().mockImplementation(async (_id: string) => {
    try {
      const gig = await prisma.gig.findFirst({
        where: { id: _id },
        include: { location: true },
      });
      return gig;
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured. Please try again.")
    }
  }),
}

let mockEventsService = {
  findOne: jest.fn().mockImplementation(async (_id: string) => {
    try {
      const event = await prisma.event.findFirst({
        where: { id: _id },
        include: { location: true },
      });
      return event
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
    } catch (error) {
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
          event: true,
          gig: true,
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
          event: true,
          gig: true,
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
    const address =
    data.city +
    " " +
    data.district +
    " " +
    data.province +
    " " +
    data.country;
  const location = await mockGoogleMapsService.getCoordinates(address);
  console.log("location", location);

  const result = await prisma.location.create({
    data: {
      userId: userId,
      country: data.country,
      province: data.province,
      district: data.district,
      city: data.city,
      location_type: data.location_type,

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
      const address =
        data.city +
        " " +
        data.district +
        " " +
        data.province +
        " " +
        data.country;
      const location = await mockGoogleMapsService.getCoordinates(address);
      console.log("location", location);
      if (data.gigId) {
        const result = await prisma.location.create({
          data: {
            country: data.country,
            province: data.province,
            district: data.district,
            city: data.city,
            gigId: data.gigId,
  
            location_type: data.location_type,
  
            Latitude: location.lat,
  
            Langitude: location.lng,
          },
        });
        if (result) {
          return result;
        } else {
          throw new BadRequestException("Please try again later");
        }
      } else if (data.eventId) {
        const result = await prisma.location.create({
          data: {
            eventId: data.eventId,
            country: data.country,
            province: data.province,
            district: data.district,
            city: data.city,
            location_type: data.location_type,
  
            Latitude: location.lat,
  
            Langitude: location.lng,
          },
        });
        if (result) {
          return result;
        } else {
          throw new BadRequestException("Please try again later");
        }
      } else if (data.postId) {
        const result = await prisma.location.create({
          data: {
            postId: data.postId,
            country: data.country,
            province: data.province,
            district: data.district,
            city: data.city,
            location_type: data.location_type,
  
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

let mockGlobalSearchService = {
  globalSearch: jest.fn().mockImplementation(async (text: string) => {
    try {
      
      const users = await findmatchingUser(text);
      const posts = await findmatchingPost(text);
      const events = await findmatchingEvent(text);
      const gigs = await findmatchingGig(text);
      const locations = await findmatchingLocation(text);
      return {
        users,
        gigs,
        events,
        posts,
        locations,
      }; 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }),

  globalSearchByDistance: jest.fn().mockImplementation(async (userId: string, distance: any, text: string) => {
    try {
      const users = await globalSearchUserByDistance(userId, distance, text)
      const posts = await globalSearchPostByDistance(userId, distance, text)
      const gigs = await globalSearchGigByDistance(userId, distance, text)
      const events = await globalSearchEventByDistance(userId, distance, text)
      const locations = await globalSearchLocationByDistance(userId, distance,text)
      return { users, posts, gigs, events, locations }
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

  globalSearchGigByDistance: jest.fn().mockImplementation(async (userId: string, distance: any, text: string) => {
    try {
      const filteredGig = [];
      const gigs = await findmatchingGig(text);
      console.log("gigs", gigs);
      if (gigs) {
        for (let i = 0; i < gigs.length; i++) {
          const element = gigs[i];
          const gigId = element.id;
          const data = { gigId, distance };
          const result = await findGigDistance(userId, data);
          console.log("gig", result);
  
          if (result) {
            filteredGig.push(element);
          }
          console.log("filteredGig", filteredGig);
        }
  
        return filteredGig;
      } 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }),

  globalSearchEventByDistance: jest.fn().mockImplementation(async (userId: string, distance: any, text: string) => {
    try {
      const filteredEvent = [];
      // @ts-ignore
      const events = await findmatchingEvent(text);
      console.log("events", events);
      if (events) {
        for (let i = 0; i < events.length; i++) {
          const element = events[i];
          const eventId = element.id;
          const data = { eventId, distance };
          // @ts-ignore
          const result = await findEventDistance(userId, data);
          console.log("post", result);
  
          if (result) {
            filteredEvent.push(element);
          }
          console.log("filteredEvent", filteredEvent);
        }
  
        return filteredEvent;
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
      // @ts-ignore
      const users = await findmatchingUser(text);
      console.log("result", users);
      if (users) {
        for (let i = 0; i < users.length; i++) {
          const element = users[i];
          const newUserId = element.id;
          const data = { newUserId, distance };
          // @ts-ignore
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

  findUserDistance: jest.fn().mockImplementation(async (myuserId: string, data: any) => {
    try {
      const myUser = await mockUsersService.getUserFromId(myuserId);
      const otherUser = await mockUsersService.getUserFromId(data.userId);
      console.log("otherUser", otherUser);
      console.log("myUser", myUser);
      if (!myUser || otherUser) {
        return false
      }
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
  }),

  findEventDistance: jest.fn().mockImplementation(async (userId: string, data: any) => {
    try {
      const user = await mockUsersService.getUserFromId(userId)
      const event = await mockEventsService.findOne(data.eventId)
      if (!event || ! user) {
        return false
      }
      const a = {
        latitude: user.location[0].Latitude,
        longitude: user.location[0].Langitude,
      };
  
      const b = {
        latitude: event.location[0].Latitude,
        longitude: event.location[0].Langitude,
      };
  
      const calculatedDistance = mockLocationService.getDistanceUsingHaversine(
        a,
        b
      );
      if (calculatedDistance === data.distance) {
        const message = "event exists inside the distance";
        return message;
      } 
      else if (data.distance > calculatedDistance) {
        const message = "event exists inside the distance";
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
  }),

  findLocationDistance: jest.fn().mockImplementation(async (userId: string, data: any) => {
    try {
      const user = await mockUsersService.getUserFromId(userId);
      const location = await mockLocationService.findOne(data.postId);
      console.log("location", location);
      if (!user || !location) {
        return false
      }
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
  }),

  findPostDistance: jest.fn().mockImplementation(async (userId: string, data: any) => {
    try {
      const user = await mockUsersService.getUserFromId(userId);
      const post = await mockPostsService.findOne(data.postId);
      if (!post || !user) {
        return false
      }
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
  }),

  findGigDistance: jest.fn().mockImplementation(async (userId: string, data: any) => {
    try {
      const user = await mockUsersService.getUserFromId(userId);
      const gig = await mockGigsService.findOne(data.gigId);
      console.log("gig", gig);
      if (!gig || !user) {
        return false
      }
      const a = {
        latitude: user.location[0].Latitude,
        longitude: user.location[0].Langitude,
      };
  
      const b = {
        latitude: gig.location[0].Latitude,
        longitude: gig.location[0].Langitude,
      };
  
      const calculatedDistance = mockLocationService.getDistanceUsingHaversine(
        a,
        b
      );
      if (calculatedDistance === data.distance) {
        const message = "event exists inside the distance";
        return message;
      } else if (data.distance > calculatedDistance) {
        const message = "event exists inside the distance";
        return message;
      } else {
        return false;
      } 
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }),
}

describe("GlobalSearchController", () => {
  let controller: GlobalSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalSearchController],
      providers: [
        GlobalSearchService, 
        PrismaService, 
        EventsService,
        GigsService,
        LocationsService,
        PostsService,
        UsersService,
        TimezonesService,
        GoogleMapsService,
        PasswordsService,
        ConfigService,
        TokensService
      ],
    })
    .overrideProvider(GlobalSearchService)
    .useValue(mockGlobalSearchService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<GlobalSearchController>(GlobalSearchController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  it("should define a function for global search", () => {
    expect(controller.globalSearch).toBeDefined()
  })

  let user: any
  let req: any
  let manualReq = {user: {id: '63cf4ccadfc19cc0f1e335f4'}}
  it("should search users, posts, events, gigs, locations", async () => {
    const globalSearchReturn = await controller.globalSearch('Rami')
    console.log('globalSearchReturn', globalSearchReturn)
    user = globalSearchReturn
    req = {user: {id: globalSearchReturn.users[0].id}}
    expect(globalSearchReturn).toEqual({
      users: expect.any(Array),
      gigs: expect.any(Array),
      events: expect.any(Array),
      posts: expect.any(Array),
      locations: expect.any(Array)
    })
  })

  it("should define a function for global search by distance", () => {
    expect(controller.globalSearchByDistance).toBeDefined()
  })

  it("should search users, posts, events, gigs, locations by distance", async () => {
    const globalSearchByDistanceReturn = await controller.globalSearchByDistance(req || manualReq, '50', 'Daena')
    expect(globalSearchByDistanceReturn).toEqual({
      users: expect.any(Array),
      gigs: expect.any(Array),
      events: expect.any(Array),
      posts: expect.any(Array),
      locations: expect.any(Array)
    })
  })

  it("should define a function for global search of event by distance", () => {
    expect(controller.globalSearchEventByDistance).toBeDefined()
  })

  it("should search event by distance", async () => {
    const globalSearchEventByDistanceReturn = await controller.globalSearchEventByDistance(req || manualReq, '50', "Daena")
    expect(globalSearchEventByDistanceReturn).toEqual(expect.any(Array))
  })

  it("should define a function for global search of gig by distance", () => {
    expect(controller.globalSearchGigByDistance).toBeDefined()
  })

  it("should search gig by distance", async () => {
    const globalSearchGigByDistanceReturn = await controller.globalSearchGigByDistance(req || manualReq, '50', "Daena")
    expect(globalSearchGigByDistanceReturn).toEqual(expect.any(Array))
  })

  it("should define a function for global search of location by distance", () => {
    expect(controller.globalSearchLocationByDistance).toBeDefined()
  })

  it("should search locations by distance", async () => {
    const globalSearchLocationByDistanceReturn = await controller.globalSearchLocationByDistance(req || manualReq, '50', 'Daena')
    expect(globalSearchLocationByDistanceReturn).toEqual(expect.any(Array))
  })

  it("should define a function for global search of post by distance", () => {
    expect(controller.globalSearchPostByDistance).toBeDefined()
  })

  it("should search post by distance", async () => {
    const globalSearchPostByDistanceReturn = await controller.globalSearchPostByDistance(req || manualReq, '50', "Daena")
    expect(globalSearchPostByDistanceReturn).toEqual(expect.any(Array))
  })

  it("should define a function for global search of user by distance", () => {
    expect(controller.globalSearchUserByDistance).toBeDefined()
  })

  it("should search user by distance", async () => {
    const globalSearchUserByDistanceReturn = await controller.globalSearchUserByDistance(req || manualReq, '50', "Daena")
    expect(globalSearchUserByDistanceReturn).toEqual(expect.any(Array))
  })

  it("should define a function for global search (without text) of location by distance", () => {
    expect(controller.globalSearchLocationByDistanceWithoutText).toBeDefined()
  })

  it("should search locations (without text) by distance", async () => {
    // const globalSearchLocationByDistanceWithoutTextReturn = await controller.globalSearchLocationByDistanceWithoutText(req, '50')
    // expect(globalSearchLocationByDistanceWithoutTextReturn).toEqual(expect.any(Array))
  })

  it("should define a function for finding the user in distance", () => {
    expect(controller.findUserInDistance).toBeDefined()
  })

  it("should find the user in distance", async () => {
    const findUserInDistanceReturn = await controller.findUserInDistance(req || manualReq, findUserDistanceDto)
    expect(findUserInDistanceReturn).toEqual(expect.any(Boolean))
  })

  it("should define a function for finding the event in distance", () => {
    expect(controller.findUserInDistance).toBeDefined()
  })

  it("should find the event in distance", async () => {
    const findEventInDistanceReturn = await controller.findEventInDistance(req || manualReq, findEventDistanceDto)
    expect(findEventInDistanceReturn).toEqual(expect.any(Boolean))
  })

  it("should define a function for finding the gig in distance", () => {
    expect(controller.findGigInDistance).toBeDefined()
  })

  it("should find the gig in distance", async () => {
    const findGigInDistanceReturn = await controller.findGigInDistance(req || manualReq, findGigDistanceDto)
    expect(findGigInDistanceReturn).toEqual(expect.any(Boolean))
  })

  it("should define a function for finding the post in distance", () => {
    expect(controller.findPostInDistance).toBeDefined()
  })

  it("should find the post in distance", async () => {
    const findPostInDistanceReturn = await controller.findPostInDistance(req || manualReq, findPostDistanceDto)
    expect(findPostInDistanceReturn).toEqual(expect.any(Boolean))
  })
})
