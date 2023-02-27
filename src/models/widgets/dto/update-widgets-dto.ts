import { PartialType } from "@nestjs/swagger";
import { CreateWidgetDto } from "./create-widgets-dto";

export class UpdateWidgetDto extends PartialType(CreateWidgetDto) {}