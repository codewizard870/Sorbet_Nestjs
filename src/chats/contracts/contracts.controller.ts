import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ContractsService } from "./contracts.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";

@ApiBearerAuth()
@ApiTags("Contracts")
@Controller("/contracts")
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post("create")
  async create(@Body() createContractDto: CreateContractDto) {
    return await this.contractsService.create(createContractDto);
  }

  @Get("myContracts/:userId")
  async findOneByUserId(@Param("userId") userId: string) {
    return await this.contractsService.getContractByUserId(userId);
  }

  @Get("myContracts/:userId/:role")
  async findOneByUserIdWithRole(@Param("userId") userId: string, @Param("role") role: string ) {
    return await this.contractsService.getContractByUserIdWithRole(userId, role);
  }
}
