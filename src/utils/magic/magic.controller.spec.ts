import { HttpStatus, Request, Response } from "@nestjs/common";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { MagicController } from "./magic.controller";
import { MagicService } from "./magic.service";
import { SessionSerializer } from "./serializer/session.serializer";
import { MagicAuthGuard } from "./guards/magic.guard";
import { isGuarded } from "test/utils";


describe("MagicController", () => {
    let controller: MagicController;

    const mockMagicService = {

    }

    const mockMagicAuthGuard = {

    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MagicController],
            providers: [
                SessionSerializer, 
                MagicService,
                MagicAuthGuard
            ],
        })
        .overrideProvider(MagicService)
        .useValue(mockMagicService)
        // .overrideGuard(MagicAuthGuard)
        // .useValue(mockMagicAuthGuard)
        .compile()

        controller = module.get<MagicController>(MagicController)
    })

    it("should be defined", async () => {
        expect(controller).toBeDefined();
    })

    it("should expect login function to be defined", async () => {
        expect(controller.login).toBeDefined()
    })

    it(`should be protected with MagicAuthGuard.`, async () => {
        // expect(isGuarded(controller.prototype.findMe, MagicAuthGuard)).toBe(true)
    })

    it("should create a user", async () => {
        // const loggedInMagic = await controller.login({user: {}}, {})
        // console.log(loggedInMagic)
     })
        
    it("should expect getAll function to be defined", async () => {
        expect(controller.getAll).toBeDefined()
    })

    it("should return all of the users in a json object", () => {
        // expect(controller.getAll({isAuthenticated: {}}, {}))
    })

    it("should expect logout function to be defined", async () => {
        expect(controller.logout).toBeDefined()
    })

    it("should log the user out", () => {
        // expect(controller.logout({}, {}))
    })
})