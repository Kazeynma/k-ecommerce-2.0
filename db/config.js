import mysql from 'mysql2';

//connection avec la base de donnée simple
export const connection = mysql.createConnection({
    host: "",
    user: "root",
    database: "ecommerce",
    password: "notSecureChangeMe",
    port: "3306"
}).once('connection', (stream) => {
    console.log("Connected to db")
})

//try async connection 
const pool = mysql.createPool({
    host: "",
    user: "root",
    database: "ecommerce",
    password: "notSecureChangeMe",
    port: "3306",
    waitForConnections: true,
})

//permet d'avoir une promise
export const promisePool = pool.promise()