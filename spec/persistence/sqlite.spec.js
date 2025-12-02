const db = require('../../src/persistence/sqlite');
const fs = require('fs');
const path = require('path');

// Fichier SQLite temporaire unique pour ce test
const location = process.env.SQLITE_DB_LOCATION || path.join('C:', 'etc', 'todos', `todo-${Date.now()}.db`);

const ITEM = {
    id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
    name: 'Test',
    completed: false,
};

// Supprime le fichier avant chaque test, ignore si bloqué
beforeEach(() => {
    if (fs.existsSync(location)) {
        try {
            fs.unlinkSync(location);
        } catch (err) {
            console.log('Fichier bloqué, test continue');
        }
    }
});

test('it initializes correctly', async () => {
    await db.init();
});

test('it can store and retrieve items', async () => {
    await db.init();
    await db.storeItem(ITEM);

    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(ITEM);
});

test('it can update an existing item', async () => {
    await db.init();
    const initialItems = await db.getItems();
    expect(initialItems.length).toBe(0);

    await db.storeItem(ITEM);
    await db.updateItem(ITEM.id, { ...ITEM, completed: !ITEM.completed });

    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0].completed).toBe(!ITEM.completed);
});

test('it can remove an existing item', async () => {
    await db.init();
    await db.storeItem(ITEM);

    await db.removeItem(ITEM.id);

    const items = await db.getItems();
    expect(items.length).toBe(0);
});

test('it can get a single item', async () => {
    await db.init();
    await db.storeItem(ITEM);

    const item = await db.getItem(ITEM.id);
    expect(item).toEqual(ITEM);
});
