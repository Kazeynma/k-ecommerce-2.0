import mysql from 'mysql2';

//connection avec la base de donnée 
export const connection = mysql.createConnection({
    host: "",
    user: "root",
    database: "ecommerce",
    password: "notSecureChangeMe",
    port: "3306"
}).once('connection', (stream) => {
    console.log("Connected to db")
})