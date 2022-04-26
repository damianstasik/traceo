import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PassportModule } from '@nestjs/passport';
import { MongodbModule } from 'src/db/mongodb.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';
import { CommentsGateway } from 'src/websockets/comments.gateway';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongodbModule,
    WebsocketsModule
  ],
  providers: [CommentsService, CommentsGateway],
  controllers: [CommentsController]
})
export class CommentsModule {}
