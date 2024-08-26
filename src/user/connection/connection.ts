import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class Connection {
  getName(): string {
    return null;
  }
}

@Injectable()
export class MySQLConnection extends Connection {
  getName(): string {
    return 'mysql';
  }
}

@Injectable()
export class PostgresConnection extends Connection {
  getName(): string {
    return 'postgres';
  }
}

export function createConnection(configService: ConfigService) {
  if (configService.get('DATABASE') == 'mysql') {
    return new MySQLConnection();
  } else {
    return new PostgresConnection();
  }
}
