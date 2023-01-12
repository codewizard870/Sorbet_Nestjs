import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "src/models/users/users.service";
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class MagicService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService
    ){}

    async updateUserMagicVerification(data: any) {
        try {
            const existingUser = await this.usersService.getUserFromEmail(data.email);
            if (existingUser) {
                const updatedUser = await this.usersService.updateUserVerification({
                    where: { email: data.email },
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        password: data.password,
                        jobProfile: data.jobProfile,
                        location: data.location,
                        bio: data.bio,
                        status: data.Status,
                        profileImage: data.profileImage,
                        confirmationCode: data.confirmationCode,
                        // magicAuth: true,
                    },
                })
                if (updatedUser) {
                    return { message: "User magic verification updated successfully!" }; 
                }
            }
            else {
                throw new Error("Unable to update user magic verification.")
                // return { message: "Unable to update user magic verification." };
            }   
        } 
        catch (error) {
            console.log(error)
            throw new Error("Unable to update user magic verification. Please try again.")
        }
    }
}