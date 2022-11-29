import { Test, TestingModule } from "@nestjs/testing";
import { JobProfileController } from "./job-profile.controller";
import { JobProfileService } from "./job-profile.service";

describe("JobProfileController", () => {
  let controller: JobProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobProfileController],
      providers: [JobProfileService],
    }).compile();

    controller = module.get<JobProfileController>(JobProfileController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
