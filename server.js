// load the things we need
import express from "express";
import bodyParser from "body-parser";

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))
// use res.render to load up an ejs view file

import { connection } from "./db/config.js";
// index page
app.get('/', function (req, res) {
    connection.query("SELECT * FROM product", (err, rows, fields) => {
        const tropicalArray = []
        const flowerArray = []
        const driedFlowerArray = []
        rows.forEach((product) => {
            if (product.category === "tropical") {
                console.log("oui", product)
                tropicalArray.push(product)
            } else if (product.category === "flower") {
                flowerArray.push(product)
            } else if (product.category === "driedFlower") {
                driedFlowerArray.push(product)
            }
        })

        res.render('pages/index', {
            tropical: tropicalArray,
            flower: flowerArray,
            diredFlower: driedFlowerArray
        })
    })
});

// contact page
app.get('/contact', function (req, res) {
    res.render('pages/contactUs');
});

// products page
app.get('/products', function (req, res) {
    connection.query("SELECT * FROM product", (err, rows, fields) => {
        const tropicalArray = []
        const flowerArray = []
        const driedFlowerArray = []
        rows.forEach((product) => {
            if (product.category === "tropical") {
                console.log("oui", product)
                tropicalArray.push(product)
            } else if (product.category === "flower") {
                flowerArray.push(product)
            } else if (product.category === "driedFlower") {
                driedFlowerArray.push(product)
            }
        })

        res.render('pages/productPage', {
            tropical: tropicalArray,
            flower: flowerArray,
            diredFlower: driedFlowerArray
        })
    })
});

//cart page
app.get('/cart', function (req, res) {
    console.log(req.body)
    res.render('pages/cart')
})

//message send page
app.get('/contact/sent', (req, res) => {
    res.render('pages/messageSend')
})

//POST
app.post('/contact', (req, res) => {
    console.log(req.body)
    const name = req.body.name
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    const sql = "INSERT INTO questions SET name = ?, email = ?, subject = ?, message = ?"
    connection.query(sql, [name, email, subject, message], (err, rows, fiedls) => {
        res.redirect("/contact/sent")
    })
})

//permet d'ajouter un produit dans la panier en utilisant son id et l'id de l'utilisateur enregistré en cookie
app.post('/cart', (req, res) => {
    console.log(req.body)
    const product = req.body.idProduct
    console.log(product)
    const sql = "INSERT INTO orders SET client_name = ?,  idProduct = ?"
    connection.query(sql, ["bob", parseInt(product)], (err, rows, fields) => {
        if (err) {
            console.log(err)
        }
        //Pour éviter que la page recharge indéfiniement et recharger les données
        res.redirect('/products')
    })
})

app.listen(5000);
console.log('5000 is the magic port');


