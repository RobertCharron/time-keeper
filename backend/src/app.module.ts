import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StationsModule } from './stations/stations.module';
import { ActivitiesModule } from './activities/activities.module';
import { ActivityUseModule } from './activity-use/activity-use.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    StationsModule,
    ActivitiesModule,
    ActivityUseModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
