import { Injectable } from '@nestjs/common';

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
