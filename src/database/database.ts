import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'tasks.db';
let database: SQLite.SQLiteDatabase | null = null;

// Abre a conexão uma vez e reaproveita a mesma instância no app.
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database !== null) {
    return database;
  }

  database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await runMigrations(database);
  return database;
}

// Cria as tabelas necessárias sem falhar quando o app abrir novamente.
async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      completed   INTEGER NOT NULL DEFAULT 0,
      createdAt   TEXT    NOT NULL
    );
  `);
}
