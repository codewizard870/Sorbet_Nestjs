import { BadRequestException, Injectable } from "@nestjs/common";
import { EventsService } from "src/models/events/events.service";
import { GigsService } from "src/models/gigs/gigs.service";
import { LocationsService } from "src/models/locations/locations.service";
import { PostsService } from "src/models/posts/posts.service";
import { UsersService } from "src/models/users/users.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateGlobalSearchDto } from "./dto/create-global-search.dto";
import { UpdateGlobalSearchDto } from "./dto/update-global-search.dto";

@Injectable()
export class GlobalSearchService {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
    private eventService: EventsService,
    private locationService: LocationsService,
    private gigsService: GigsService,
    private postsService: PostsService
  ) {}

  async globalSearch(text) {
    const users = await this.findmatchingUser(text);
    const posts = await this.findmatchingPost(text);
    const events = await this.findmatchingEvent(text);
    const gigs = await this.findmatchingGig(text);
    const locations = await this.findmatchingLocation(text);
    return {
      users,
      gigs,
      events,
      posts,
      locations,
    };
  }

  async globalSearchByDistance(userId, distance, text) {
    const users = await this.globalSearchUserByDistance(userId, distance, text);
    const posts = await this.globalSearchPostByDistance(userId, distance, text);
    const gigs = await this.globalSearchGigByDistance(userId, distance, text);
    const events = await this.globalSearchEventByDistance(
      userId,
      distance,
      text
    );
    const locations = await this.globalSearchLocationByDistance(
      userId,
      distance,
      text
    );
    return { users, posts, gigs, events, locations };
  }

  async globalSearchLocationByDistance(userId, distance, text) {
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

  async globalSearchLocationByDistanceWithoutText(userId, distance) {
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

  async globalSearchGigByDistance(userId, distance, text) {
    const filteredGig = [];
    const gigs = await this.findmatchingGig(text);
    console.log("gigs", gigs);
    if (gigs) {
      for (let i = 0; i < gigs.length; i++) {
        const element = gigs[i];
        const gigId = element.id;
        const data = { gigId, distance };
        const result = await this.findGigDistance(userId, data);
        console.log("gig", result);

        if (result) {
          filteredGig.push(element);
        }
        console.log("filteredGig", filteredGig);
      }

      return filteredGig;
    }
  }

  async globalSearchEventByDistance(userId, distance, text) {
    const filteredEvent = [];
    const events = await this.findmatchingEvent(text);
    console.log("events", events);
    if (events) {
      for (let i = 0; i < events.length; i++) {
        const element = events[i];
        const eventId = element.id;
        const data = { eventId, distance };
        const result = await this.findEventDistance(userId, data);
        console.log("post", result);

        if (result) {
          filteredEvent.push(element);
        }
        console.log("filteredEvent", filteredEvent);
      }

      return filteredEvent;
    }
  }

  async globalSearchPostByDistance(userId, distance, text) {
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

  async globalSearchUserByDistance(userId, distance, text) {
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

  async findmatchingLocation(text) {
    const location = await this.prismaService.location.findMany({
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

  async findmatchingUser(text) {
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
  async findmatchingPost(text) {
    const post = await this.prismaService.post.findMany({
      where: { text: text },
      include: { location: true },
    });

    if (post.length === 0 || post.length > 0) {
      return post;
    }
  }
  async findmatchingGig(text) {
    const gig = await this.prismaService.gig.findMany({
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
  async findmatchingEvent(text) {
    const event = await this.prismaService.event.findMany({
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

  async findUserDistance(myuserId, data) {
    const myUser = await this.userService.getUserFromId(myuserId);
    const otherUser = await this.userService.getUserFromId(data.userId);
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
        this.locationService.getDistanceUsingHarversine(a, b);
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

  async findEventDistance(userId, data) {
    const user = await this.userService.getUserFromId(userId);
    const event = await this.eventService.findOne(data.eventId);
    console.log("event", event);
    const a = {
      latitude: user.location[0].Latitude,
      longitude: user.location[0].Langitude,
    };

    const b = {
      latitude: event.location[0].Latitude,
      longitude: event.location[0].Langitude,
    };

    const calculatedDistance = this.locationService.getDistanceUsingHarversine(
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

  async findGigDistance(userId, data) {
    const user = await this.userService.getUserFromId(userId);
    const gig = await this.gigsService.findOne(data.gigId);
    console.log("gig", gig);
    const a = {
      latitude: user.location[0].Latitude,
      longitude: user.location[0].Langitude,
    };

    const b = {
      latitude: gig.location[0].Latitude,
      longitude: gig.location[0].Langitude,
    };

    const calculatedDistance = this.locationService.getDistanceUsingHarversine(
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

  async findLocationDistance(userId, data) {
    const user = await this.userService.getUserFromId(userId);
    const location = await this.locationService.findOne(data.postId);
    console.log("location", location);
    const a = {
      latitude: user.location[0].Latitude,
      longitude: user.location[0].Langitude,
    };

    const b = {
      latitude: location.Latitude,
      longitude: location.Langitude,
    };

    const calculatedDistance = this.locationService.getDistanceUsingHarversine(
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
  async findPostDistance(userId, data) {
    const user = await this.userService.getUserFromId(userId);
    const post = await this.postsService.findOne(data.postId);
    console.log("post", post);
    const a = {
      latitude: user.location[0].Latitude,
      longitude: user.location[0].Langitude,
    };

    const b = {
      latitude: post.location[0].Latitude,
      longitude: post.location[0].Langitude,
    };

    const calculatedDistance = this.locationService.getDistanceUsingHarversine(
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
}
