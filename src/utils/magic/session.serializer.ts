import { PassportSerializer } from "@nestjs/passport";
import * as Datastore from 'nedb-promise';

let users = new Datastore()

export class SessionSerializer extends PassportSerializer {
    serializeUser(user: any, done: (err: Error, user: string) => void) {
        done(null, user.issuer)
    }

    async deserializeUser(id: any, done: (err: Error, user: string) => void) {
        try {
            const user = await users.findOne({ issuer: id });
            done(null, user);
          } catch (err) {
            done(err, null);
          }
    }
}