import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { type ClassConstructor, plainToInstance } from 'class-transformer';

// Type pour un wrapper de pagination
interface PaginatedWrapper<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

@Injectable()
export class SerializationInterceptor<T>
  implements NestInterceptor<unknown, T | T[] | PaginatedWrapper<T>>
{
  constructor(private classConstructor: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<T | T[] | PaginatedWrapper<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        return this.serialize(data);
      }),
    );
  }

  private serialize(value: unknown): T | T[] | PaginatedWrapper<T> {
    const options = {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    };

    // Si on reçoit un tableau d'entités
    if (Array.isArray(value)) {
      return plainToInstance(this.classConstructor, value, options);
    }

    // Si on reçoit un wrapper (ex: PageDto { data: [...], total, ... })
    if (this.isPaginatedWrapper(value)) {
      return {
        ...value,
        data: plainToInstance(this.classConstructor, value.data, options),
      };
    }

    // Cas général (objet unique)
    return plainToInstance(this.classConstructor, value as object, options);
  }

  private isPaginatedWrapper(
    value: unknown,
  ): value is PaginatedWrapper<unknown> {
    return (
      value !== null &&
      typeof value === 'object' &&
      'data' in value &&
      Array.isArray(value.data)
    );
  }
}
