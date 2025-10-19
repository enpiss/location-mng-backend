import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { LocataireModule } from './modules/locataire/locataire.module';
import { LogementModule } from './modules/logement/logement.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaiementModule } from './modules/paiement/paiement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Note: set to false in production
    }),
    UserModule,
    LocataireModule,
    LogementModule,
    AuthModule,
    PaiementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
