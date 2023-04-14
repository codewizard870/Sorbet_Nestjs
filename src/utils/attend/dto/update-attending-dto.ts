import { PartialType } from "@nestjs/swagger";
import { CreateAttendDto } from "./create-attending-dto";

export class UpdateAttendDto extends PartialType(CreateAttendDto) {}