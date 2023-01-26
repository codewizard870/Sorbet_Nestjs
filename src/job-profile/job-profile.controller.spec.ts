import { Test, TestingModule } from "@nestjs/testing";
import { JobProfileController } from "./job-profile.controller";
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

let createJobProfileDto = {
  name: 'Software Engineer', 
  type: 'Software Development'
}

let req = {
  user: {
    id: '000102030405060708090a0b'
  }
}

describe("JobProfileController", () => {
  let controller: JobProfileController;

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

    remove: jest.fn().mockImplementation(async (id) => {
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
      controllers: [JobProfileController],
      providers: [JobProfileService, PrismaService],
    })
    .overrideProvider(JobProfileService)
    .useValue(mockProfileService)
    .compile()

    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    controller = module.get<JobProfileController>(JobProfileController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should define a function to create a job posting", () => {
    expect(controller.create).toBeDefined
  })

  let jobProfileGlobal: any
  it("should create a job profile and return the result", async () => {
    const jobProfile = await controller.create(createJobProfileDto, req)
    jobProfileGlobal = jobProfile
    expect(jobProfile).toEqual({
      id: expect.any(String),
      name: 'Software Engineer',
      type: 'Software Development',
      createdAt: expect.any(Date),
      userId: '000102030405060708090a0b'
    })
  })

  it("should define a function to get all the job profiles", () => {
    expect(controller.findAll).toBeDefined
  })

  it("should get all of the job profiles and return them", async () => {
    const jobProfileArr = await controller.findAll()
    const numJobs = jobProfileArr.length
    expect(jobProfileArr).toEqual(expect.any(Array))
    expect(jobProfileArr).toHaveLength(numJobs)
    // expect(jobProfileArr[0]).toEqual({
    //     id: expect.any(String),
    //     name: 'Software Engineer',
    //     type: 'Software Development',
    //     createdAt: expect.any(Date),
    //     user: expect.any(null),
    //     userId: '000102030405060708090a0b'
    // })
  })

  it("should define a function to get a job profile by the id", () => {
    expect(controller.findOne).toBeDefined
  })

  it("should get a job profile by the job id", async () => {
    const jobProfileArr = await controller.findOne(jobProfileGlobal.id)
    expect(jobProfileArr).toEqual(expect.any(Array))
    expect(jobProfileArr).toHaveLength(1)
    // expect(jobProfileArr[0]).toEqual({
    //     id: expect.any(String),
    //     name: 'Software Engineer',
    //     type: 'Software Development',
    //     createdAt: expect.any(Date),
    //     user: expect.any(null),
    //     userId: '000102030405060708090a0b'
    // })
  })

  it("should define a function to get a job profile by the job name", () => {
    expect(controller.getFromJobName).toBeDefined
  })

  it("should get a job profile by the job name", async () => {
    const jobProfileArr = await controller.getFromJobName(jobProfileGlobal.name)
    expect(jobProfileArr).toEqual(expect.any(Array))
    // expect(jobProfileArr[0]).toEqual({
    //     id: expect.any(String),
    //     name: 'Software Engineer',
    //     type: 'Software Development',
    //     createdAt: expect.any(Date),
    //     user: expect.any(null),
    //     userId: '000102030405060708090a0b'
    // })
  })

  it("should define a function to get a job profile by the userId", () => {
    expect(controller.getFromUserId).toBeDefined
  })

  it("should get a job profile by the job name", async () => {
    const jobProfileArr = await controller.getFromUserId(req)
    expect(jobProfileArr).toEqual(expect.any(Array))
    // expect(jobProfileArr[0]).toEqual({
    //     id: expect.any(String),
    //     name: 'Software Engineer',
    //     type: 'Software Development',
    //     createdAt: expect.any(Date),
    //     user: expect.any(null),
    //     userId: '000102030405060708090a0b'
    // })
  })

  it("should define a function to get a job profile by the job type", () => {
    expect(controller.getFromJobType).toBeDefined
  })

  it("should get a job profile by the job type", async () => {
    const jobProfileArr = await controller.getFromJobType(jobProfileGlobal.type)
    expect(jobProfileArr).toEqual(expect.any(Array))
    // expect(jobProfileArr[0]).toEqual({
    //     id: expect.any(String),
    //     name: 'Software Engineer',
    //     type: 'Software Development',
    //     createdAt: expect.any(Date),
    //     user: expect.any(null),
    //     userId: '000102030405060708090a0b'
    // })
  })

  it("should define a function to remove a job profile by the id", () => {
    expect(controller.getFromJobType).toBeDefined
  })

  it("should get a job profile by the job type", async () => {
    const jobProfileArr = await controller.remove(jobProfileGlobal.id)
    expect(jobProfileArr).toEqual({
      message: "Deleted Successfully"
    })
  })
});
