import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { PasswordsService } from "src/utils/passwords/passwords.service";
import { TokensService } from "src/utils/tokens/tokens.service";
import { LikeService } from "../../utils/like/like.service";
import { CommentService } from "../../utils/comment/comment.service";

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    PrismaService,
    UsersService,
    PasswordsService,
    TokensService,
    LikeService,
    CommentService
  ],
})
export class PostsModule {}
