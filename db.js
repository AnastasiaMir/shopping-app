import * as SQLite from 'expo-sqlite';
import { openDatabaseAsync } from 'expo-sqlite';

let db;

export const initDB = async () => {
    try {
        db = await openDatabaseAsync('shoppingCart.db');
        if (!db) {
            throw new Error('Failed to open database');
        }
        console.log("Database opened successfully");
        await createTable(); 
        return db;
    } catch (error) {
        console.error('Error initializing DB:', error);
        throw error; 
    }
};

const createTable = async () => {
    if (!db) {
        throw new Error("Database object is null in createTable");
    }
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY NOT NULL,
            image TEXT,
            title TEXT,
            price REAL,
            quantity INTEGER NOT NULL
        );
        `);
        console.log("Table created successfully");
    } catch (error) {
        console.error('Error creating table:', error);
        throw error;
    }
};

export const addToCart = async (product) => {
  
    if (!db) throw new Error("Database not initialized");
    try {
        // await db.execAsync(`Insert into cart (id, image, title, price, quantity) values (${product.id}, '${product.image}', '${product.title}',' ${product.price}', 2);`)
    await db.execAsync(`INSERT INTO cart (id, image, title, price, quantity) 
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT (id) DO UPDATE SET quantity = quantity + 1;`,
        [product.id, product.image, product.title, product.price, 1])    
    } catch (error) {
        console.error("Error in addToCart:", error);
        throw error;
    }
};


export const getCartItems = async () => {
    if (!db) throw new Error("Database not initialized");
    try{
        const rows = await db.execAsync('SELECT * FROM cart');
        return rows || [];
    } catch(error){
        console.error("Error in getCartItems:", error);
        return [];
    }
};


export const closeDB = async () => {
    if (db) {
        db.close();
    }
};

export const dropDB = () => {
    const db = SQLite.openDatabaseSync('cart.db');

    db.execSync('DROP TABLE IF EXISTS cart;');
    db.closeSync();

    console.log('Таблица cart удалена');
};