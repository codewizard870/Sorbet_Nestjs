import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";

@Injectable()
export class ContractsService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateContractDto) {
    try {
      const userIdCheck = await this.prismaService.contract.findFirst({
        where: {
          OR: [
            { freelancerId: data.freelancerId, clientId: data.clientId },
            { freelancerId: data.clientId, clientId: data.freelancerId },
          ],
        },
      });
      if (userIdCheck) {
        console.log(
          `User ${data.clientId} is already contact with ${data.freelancerId}`
        );
        throw new Error(
          `User ${data.clientId} is already contact with ${data.freelancerId}`
        );
      }
      const result = await this.prismaService.contract.create({
        data: {
          freelancerId: data.freelancerId,
          clientId: data.clientId,
          jobTitle: data.jobTitle,
          jobDescription: data.jobDescription,
          budget: data.budget,
          startTime: data.startTime,
          status: "initContract",
          projectId:
            data.clientId +
            "-" +
            data.freelancerId +
            "-" +
            Date.now().toString(),
        },
      });
      if (result) {
        return result;
      }
    } catch (error) {
      console.error(error);
      throw new Error("An error occured. Please try again.");
    }
  }

  async getContractByUserId(id: string) {
    try {
      const contract = await this.prismaService.contract.findMany({
        where: {
          OR: [{ freelancerId: id }, { clientId: id }],
        },
        include: { freelancer: true, client: true },
      });

      if (contract) {
        return contract;
      } else {
        throw new BadRequestException("contact not found");
      }
    } catch (error) {
      console.error(error);
      throw new Error("An error occured. Please try again.");
    }
  }

  async getContractByUserIdWithRole(id: string, role: string) {
    try {
      let contract;
      if (role == 'client') {
         contract = await this.prismaService.contract.findMany({
          where: {
            clientId: id,
          },
          include: { freelancer: true, client: true },
        });
      } else {
         contract = await this.prismaService.contract.findMany({
          where: {
            freelancerId: id,
          },
          include: { freelancer: true, client: true },
        });
      }

      if (contract) {
        return contract;
      } else {
        throw new BadRequestException("contact not found");
      }
    } catch (error) {
      console.error(error);
      throw new Error("An error occured. Please try again.");
    }
  }
}
