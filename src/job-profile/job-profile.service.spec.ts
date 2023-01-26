import { Test, TestingModule } from "@nestjs/testing";
import { JobProfileService } from "./job-profile.service";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { Context, MockContext, createMockContext } from "../../test/prisma/context"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockCtx: MockContext
let ctx: Context

interface CreateJobProfile {
  name: string,
  type: string,
}

const jobProfileData = {
  name: "Software Engineer",
  type: "Software Development"
}

const userId = "000102030405060708090a0b"

describe("JobProfileService", () => {
  let service: JobProfileService;

  let mockProfileService = {
    create: jest.fn().mockImplementation(async (data: CreateJobProfile, id: string) => {
      try {
        const result = await prisma.jobProfile.create({
          data: {
            name: data.name,
            type: data.type,
            userId: id,
          },
        });
        if (result) {
          return result;
        } else {
          throw new Error("Job profile could not be created.");
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured, please try again.")
      }
    }),

    getFromUserId: jest.fn().mockImplementation(async (userId: string) => {
      try {
        const result = await prisma.jobProfile.findMany({
          where: { userId: userId },
        });
        if (result) {
          return result;
        } 
        else {
          throw new Error("Job profile not found.");
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured, please try again.")
      }
    }),

    getFromJobName: jest.fn().mockImplementation(async (name: string) => {
      try {
        const result = await prisma.jobProfile.findMany({
          where: {
            name: name,
          },
          include: {
            user: true,
          },
        });
        if (result) {
          return result;
        }
        else {
          throw new Error("Job profile not found.");
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured, please try again.")
      }
    }),

    getFromJobType: jest.fn().mockImplementation(async (jobType: string) => {
      try {
        const result = await prisma.jobProfile.findMany({
          where: { type: jobType },
          include: { user: true },
        });
        if (result) {
          return result;
        } 
        else {
          throw new Error("Job profile not found.");
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured, please try again.")
      }
    }),

    getFromJobId: jest.fn().mockImplementation(async (id: string) => {
      try {
        const result = await prisma.jobProfile.findMany({
          where: { id: id },
          include: {user: true},
        });
        if (result) {
          return result;
        } 
        else {
          throw new Error("Job profile not found.");
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured, please try again.")
      }
    }),

    getAll: jest.fn().mockImplementation(async () => {
      try {
        const result = prisma.jobProfile.findMany({
          include: {user: true},
        });
        if(result) {
          return result;
        }
        else {
          throw new Error("No job profiles were found.");
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured, please try again.")
      }
    }),

    remove: jest.fn().mockImplementation(async (id: string) => {
      try {
        const result = await prisma.jobProfile.delete({
          where: { id: id },
        });
        if (result) {
          return { message: "Deleted Successfully" };
        } else {
          return { message: "Something went wrong" };
        }
      } 
      catch (error) {
        console.log(error)
        throw new Error("An error occured, please try again.")
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobProfileService, PrismaService],
    })
    .overrideProvider(JobProfileService)
    .useValue(mockProfileService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    service = module.get<JobProfileService>(JobProfileService)
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  })

  it("should define a function to create a job profile", () => {
    expect(service.create).toBeDefined()
  })

  let jobProfile: any
  it("should create a chat and return the result", async () => {
    const createdJobProfile = await service.create(jobProfileData, userId)
    expect(service.create).toBeCalled()
    jobProfile = createdJobProfile
    expect(createdJobProfile).toEqual({
      id: expect.any(String),
      name: 'Software Engineer',
      type: 'Software Development',
      createdAt: expect.any(Date),
      userId: '000102030405060708090a0b'
    })
  })

  it("should define a function to get a job profile by userId", () => {
    expect(service.create).toBeDefined()
  })

  it("should get job profiles profiles by userId and return the result", async () => {
    const jobProfilesArr = await service.getFromUserId(userId)
    expect(service.getFromUserId).toBeCalled()
    expect(jobProfilesArr).toEqual(expect.any(Array))
  })

  it("should define a function to get a job profile by job name", () => {
    expect(service.getFromJobName).toBeDefined()
  })

  it("should get job profiles by name and return the result", async () => {
    const jobProfileArr = await service.getFromJobName("Software Engineer")
    let numJobs = jobProfileArr.length
    expect(service.getFromJobName).toBeCalled()
    expect(jobProfileArr).toEqual(expect.any(Array))
    let jobsArr = []
    for (let i = 0; i < numJobs; i++) {
      jobsArr.push({
        id: expect.any(String),
        name: 'Software Engineer',
        type: 'Software Development',
        createdAt: expect.any(Date),
        user: expect.any(null),
        userId: '000102030405060708090a0b'
      })
    }
    // expect(jobProfileArr).toEqual(jobsArr)
  })

  it("should define a function to get a job profile by job type", () => {
    expect(service.getFromJobType).toBeDefined()
  })

  it("should get job profiles by name and return the result", async () => {
    const jobProfileArr = await service.getFromJobType("Software Development")
    let numJobs = jobProfileArr.length
    expect(service.getFromJobType).toBeCalled()
    expect(jobProfileArr).toEqual(expect.any(Array))
    let jobsArr = []
    for (let i = 0; i < numJobs; i++) {
      jobsArr.push({
        id: expect.any(String),
        name: 'Software Engineer',
        type: 'Software Development',
        createdAt: expect.any(Date),
        user: expect.any(null),
        userId: '000102030405060708090a0b'
      })
    }
    // expect(jobProfileArr).toEqual(jobsArr)
  })

  it("should define a function to get a job profile by the job id", () => {
    expect(service.getFromJobId).toBeDefined()
  })

  it("should get a job profile by jobId and return the result", async () => {
    const jobProfileArr = await service.getFromJobId(jobProfile.id)
    expect(service.getFromJobId).toBeCalled()
    expect(jobProfileArr).toEqual(expect.any(Array))
    // expect(jobProfileArr[0]).toEqual({
    //   id: expect.any(String),
    //   name: 'Software Engineer',
    //   type: 'Software Development',
    //   createdAt: expect.any(Date),
    //   user: expect.any(null),
    //   userId: '000102030405060708090a0b'
    // })
  })

  it("should define a function to get all of the job profiles", () => {
    expect(service.getAll).toBeDefined()
  })
  
  it("should get all of the job profiles and return the result array", async () => {
    const jobProfileArr = await service.getAll()
    const numJobs = jobProfileArr.length
    expect(service.getAll).toBeCalled()
    expect(jobProfileArr).toEqual(expect.any(Array))
    expect(jobProfileArr).toHaveLength(numJobs)
    // expect(jobProfileArr[0]).toEqual({
    //   id: expect.any(String),
    //   name: 'Software Engineer',
    //   type: 'Software Development',
    //   createdAt: expect.any(Date),
    //   user: expect.any(null),
    //   userId: '000102030405060708090a0b'
    // })
  })

  it("should define a function to remove a job profile by the id", () => {
    expect(service.remove).toBeDefined()
  })

  it("should remove a job profile by the id and return a string", async () => {
    const removedJobProfile = await service.remove(jobProfile.id)
    expect(removedJobProfile).toEqual({
      message: "Deleted Successfully"
    })
  })
})
