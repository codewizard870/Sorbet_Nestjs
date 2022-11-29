import { Injectable } from "@nestjs/common";
import { CreateTimezoneDto } from "./dto/create-timezone.dto";
import { UpdateTimezoneDto } from "./dto/update-timezone.dto";

@Injectable()
export class TimezonesService {
  create(createTimezoneDto: CreateTimezoneDto) {
    //     var date = new Date();
    // // var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
    // //                 date.getUTCDate(), date.getUTCHours(),
    // //                 date.getUTCMinutes(), date.getUTCSeconds());
    // var new_utc = new Date(date.toUTCString());
    // var newlocalDate = new Date(new_utc + ' UTC');
    // var localDate = new Date(new_utc);
    // // const isoDate = new Date(date).toISOString();
    // console.log(newlocalDate);
    // // console.log(date.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}).toString())
    // // console.log(newlocalDate.getTimezoneOffset()/60);
    // // console.log(date);
    // // console.log(date.toString());
    // console.log(new_utc)
    // console.log(localDate.toString());
    // console.log(localDate);
    // // console.log(new Date(localDate.toISOString()));
    // // console.log(new_utc.toLocaleString().toString());
    // // console.log(date.getTimezoneOffset());
  }

  convertToUtc(getdate) {
    const date = new Date(getdate);
    var new_utc = new Date(date.toUTCString());
    return new_utc;
  }

  findAll() {
    return `This action returns all timezones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timezone`;
  }

  update(id: number, updateTimezoneDto: UpdateTimezoneDto) {
    return `This action updates a #${id} timezone`;
  }

  remove(id: number) {
    return `This action removes a #${id} timezone`;
  }
}
