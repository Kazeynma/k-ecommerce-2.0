import { promisePool } from "../config.js";

//permet d'avoir un produit à partir de son id 
const getProductWithId = async (id) => {
    const [rows, fields] = await promisePool.query("SELECT * FROM product WHERE id = ?", [id])
    return rows
}

//permet d'ajouter une commande
const addOrder = async (idClient, idProduct) => {
    const sql = "INSERT INTO orders SET idClient = ?, idProduct = ?"
    const [rows, fields] = await promisePool.query(sql, [idClient, idProduct])
    return rows
}

export const productsFonction = {
    getProductWithId,
    addOrder
}