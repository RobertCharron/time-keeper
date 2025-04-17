import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StationsModule } from './stations/stations.module';
import { ActivitiesModule } from './activities/activities.module';
import { ActivityUseModule } from './activity-use/activity-use.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    StationsModule,
    ActivitiesModule,
    ActivityUseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
