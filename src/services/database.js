/* global CapacitorSQLite */
const DB_NAME = 'catastro-db';
const TABLE = 'fichas';
const STORAGE_KEY = 'catastro-fichas';

let initialized = false;

const hasPlugin = () => typeof CapacitorSQLite !== 'undefined';

const ensureLocalStorage = () => {
  if (typeof localStorage === 'undefined') {
    return [];
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('No se pudo parsear el almacenamiento local', error);
    return [];
  }
};

const persistLocalStorage = (data) => {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const initDatabase = async () => {
  if (initialized) {
    return;
  }
  if (hasPlugin()) {
    try {
      await CapacitorSQLite.createConnection({
        database: DB_NAME,
        version: 1,
        encrypted: false,
        mode: 'no-encryption'
      });
      await CapacitorSQLite.open({ database: DB_NAME });
      await CapacitorSQLite.execute({
        database: DB_NAME,
        statements: `CREATE TABLE IF NOT EXISTS ${TABLE} (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            nombre TEXT,\n            direccion TEXT,\n            descripcion TEXT,\n            lat REAL,\n            lng REAL,\n            foto TEXT,\n            fecha INTEGER\n          );`
      });
      initialized = true;
      return;
    } catch (error) {
      console.warn('Fallo inicializando SQLite, usando almacenamiento local', error);
    }
  }
  initialized = true;
};

export const saveFicha = async (ficha) => {
  if (!initialized) {
    await initDatabase();
  }

  if (hasPlugin()) {
    try {
      await CapacitorSQLite.run({
        database: DB_NAME,
        statements: `INSERT INTO ${TABLE} (nombre, direccion, descripcion, lat, lng, foto, fecha) VALUES (?,?,?,?,?,?,?);`,
        values: [
          ficha.nombre,
          ficha.direccion,
          ficha.descripcion,
          ficha.lat,
          ficha.lng,
          ficha.foto,
          ficha.fecha
        ]
      });
      return;
    } catch (error) {
      console.warn('Fallo al guardar en SQLite, usando localStorage', error);
    }
  }

  const current = ensureLocalStorage();
  current.push(ficha);
  persistLocalStorage(current);
};

export const getPendingFichas = async () => {
  if (!initialized) {
    await initDatabase();
  }

  if (hasPlugin()) {
    try {
      const result = await CapacitorSQLite.query({
        database: DB_NAME,
        statement: `SELECT rowid as id, nombre, direccion, descripcion, lat, lng, foto, fecha FROM ${TABLE};`
      });
      return result.values || [];
    } catch (error) {
      console.warn('Fallo al leer SQLite, usando localStorage', error);
    }
  }

  return ensureLocalStorage();
};

export const clearFichas = async () => {
  if (!initialized) {
    await initDatabase();
  }

  if (hasPlugin()) {
    try {
      await CapacitorSQLite.execute({
        database: DB_NAME,
        statements: `DELETE FROM ${TABLE};`
      });
      return;
    } catch (error) {
      console.warn('No se pudo limpiar SQLite, limpiando localStorage', error);
    }
  }

  persistLocalStorage([]);
};

export const deleteFichasByIds = async (ids = []) => {
  if (!initialized) {
    await initDatabase();
  }

  if (!ids.length) {
    return;
  }

  if (hasPlugin()) {
    try {
      const placeholders = ids.map(() => '?').join(',');
      await CapacitorSQLite.run({
        database: DB_NAME,
        statement: `DELETE FROM ${TABLE} WHERE rowid IN (${placeholders});`,
        values: ids
      });
      return;
    } catch (error) {
      console.warn('No se pudieron eliminar en SQLite, actualizando localStorage', error);
    }
  }

  const current = ensureLocalStorage();
  const filtered = current.filter((ficha) => !ids.includes(ficha.fecha));
  persistLocalStorage(filtered);
};
