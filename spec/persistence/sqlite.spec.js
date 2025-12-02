const db = require('../../src/persistence/sqlite');
const fs = require('fs');
const path = require('path');

// Crée un fichier SQLite temporaire unique pour chaque test
const location = process.env.SQLITE_DB_LOCATION || path.join('C:', 'etc', 'todos', `todo-${Date.now()}.db`);

const ITEM = {
    id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
    name: 'Test',
    completed: false,
};

// Supprime le fichier avant chaque test, ignore l'erreur si le fichier est bloqué
beforeEach(() => {
    if (fs.existsSync(location)) {
        try {
            fs.unlinkSync(location);
        } catch (err) {
            console.log('Fichier bloqué ou utilisé, le test continue');
        }
    }
});

// Initialise la base
test('it initializes correctly', async () => {
    await db.init();
});

// Stocke et récupère un item
test('it can store and retrieve items', async () => {
    await db.init();
    await db.storeItem(ITEM);

    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(ITEM);
});

// Met à jour un item existant
test('it can update an existing item', async () => {
    await db.init();

    const initialItems = await db.getItems();
    expect(initialItems.length).toBe(0);

    await db.storeItem(ITEM);

    await db.updateItem(
        ITEM.id,
        Object.assign({}, ITEM, { completed: !ITEM.completed }),
    );

    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0].completed).toBe(!ITEM.completed);
});

// Supprime un item
test('it can remove an existing item', async () => {
    await db.init();
    await db.storeItem(ITEM);

    await db.removeItem(ITEM.id);

    const items = await db.getItems();
    expect(items.length).toBe(0);
});

// Récupère un item unique
test('it can get a single item', async () => {
    await db.init();
    await db.storeItem(ITEM);

    const item = await db.getItem(ITEM.id);
    expect(item).toEqual(ITEM);
});
