import Dexie from 'dexie';

export const db = new Dexie('notesTasks');

db.version(1).stores({
  notes: '++id, title, content, dateCreated, dateModified, *tags',
  tags: '++id, value, label',
});
