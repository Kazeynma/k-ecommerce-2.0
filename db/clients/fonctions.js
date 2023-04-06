import { promisePool } from "../config.js"

//permet de récupérer tous les clients
const getClients = async () => {
    const [rows, fields] = await promisePool.query("SELECT * FROM clients")
    return rows
}

//permet de récupérer un client avec son email
const getClientWithEmail = async (email) => {
    const [rows, fields] = await promisePool.query("SELECT * FROM clients WHERE email = ?", [email])
    return rows
}

//permet d'ajouter un client 
const addClient = async (data) => {
    const client_lastname = data.lastname
    const client_firstname = data.firstname
    const client_email = data.email
    const client_adress = data.adress
    const client_zipCode = data.zipCode
    const sql = "INSERT INTO clients SET lastname = ?, firstname = ?, email = ?, adress = ?, zipCode = ?"

    console.log(client_adress)
    const [rows, fields] = await promisePool.query(sql, [client_lastname, client_firstname, client_email, client_adress, client_zipCode])
    return rows
}


export const clientFunction = {
    getClients,
    getClientWithEmail,
    addClient
}
