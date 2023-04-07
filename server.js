// load the things we need
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from 'uuid';

const app = express();
//to have ejs
app.set('view engine', 'ejs');
//to import images and style for pages
app.use(express.static('public'));
//to send data
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
// to use express session for coockies
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: (1000 * 60 * 60 * 24) },
    genid: function (req) {
        return uuidv4() // utilisation de uuidv4 pour les session id
    },
}))



import { connection } from "./db/config.js";

//import function
import { clientFunction } from "./db/clients/fonctions.js";
import { productsFonction } from "./db/produits/fonctions.js";

//GET --------------------------------------------------------------------------------------------------
// index page
app.get('/', function (req, res) {
    if (!req.session.cart) {
        req.session.cart = []
        req.session.cartTotal = 0
    }
    connection.query("SELECT * FROM product", (err, rows, fields) => {
        const tropicalArray = []
        const flowerArray = []
        const driedFlowerArray = []
        rows.forEach((product) => {
            if (product.category === "tropical") {
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
            diredFlower: driedFlowerArray,

        })
    })
});

// contact page
app.get('/contact', function (req, res) {
    res.render('pages/contactUs');
});

// products page
app.get('/products', function (req, res) {
    console.log(req.session)
    console.log(req.session.cart)
    connection.query("SELECT * FROM product", (err, rows, fields) => {
        const tropicalArray = []
        const flowerArray = []
        const bouquetArray = []
        const driedFlowerArray = []
        const seedsArray = []
        rows.forEach((product) => {
            if (product.category === "tropical") {
                tropicalArray.push(product)
            } else if (product.category === "flower") {
                flowerArray.push(product)
            } else if (product.category === "driedFlower") {
                driedFlowerArray.push(product)
            } else if (product.category === "bouquet") {
                bouquetArray.push(product)
            } else if (product.category === "seeds") {
                seedsArray.push(product)
            }
        })
        res.render('pages/productPage', {
            tropical: tropicalArray,
            flower: flowerArray,
            diredFlower: driedFlowerArray,
            bouquet: bouquetArray,
            seeds: seedsArray
        })
    })
});

//cart page
app.get('/cart', function (req, res) {
    res.render('pages/cart', {
        cart: req.session.cart || [],
        cartTotal: req.session.cartTotal ? req.session.cartTotal : 0
    })
})

//message send page
app.get('/contact/sent', (req, res) => {
    res.render('pages/messageSend')
})

//POST ---------------------------------------------------------------------------------------------
app.post('/contact', (req, res) => {
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
app.post('/cart', async (req, res) => {
    let cart
    let cartTotal
    if (!req.session.cart) {
        cart = []
        cartTotal = 0
    } else {
        cart = req.session.cart
        cartTotal = req.session.cartTotal
    }

    //permet de récupérer les informations du produit à partir de son id pour pouvoir les afficher dans la page cart
    let result = await productsFonction.getProductWithId(req.body.idProduct)
    cart.push(result[0])
    cartTotal = cartTotal + result[0].price
    req.session.cart = cart
    req.session.cartTotal = cartTotal

    res.render('pages/cart', {
        cart: req.session.cart,
        cartTotal: req.session.cartTotal
    })
})

//permet de retirer des éléments du panier (efface de temps en temps tous le panier)
app.post('/cart/delete', (req, res) => {
    let cart = req.session.cart

    let newCart = cart.slice(req.body.idProduct)
    req.session.cart = newCart

    res.redirect("/cart")
})

//permet d'ajouter la commande dans une base de données 
app.post('/cart/add', async (req, res) => {
    const cart = req.session.cart
    // récupère le client à partir de son adresse email => si retourne un tableau vide => le client n'existe pas et en créer un 
    const client = await clientFunction.getClientWithEmail(req.body.email)
    const sessionId = req.session.id.slice(25) //réduit la taille de l'uuid 

    if (!cart) {
        res.redirect("/products")
    }
    if (client.length === 0) {
        let newClient = await clientFunction.addClient(req.body)
        cart.forEach((product) => {
            productsFonction.addOrder(sessionId, newClient.insertId, product.id)
            req.session.cart = []
            req.session.cartTotal = 0
        })
    } else {
        cart.forEach((product) => {
            productsFonction.addOrder(sessionId, client[0].id, product.id)
            req.session.cart = []
            req.session.cartTotal = 0
        })
    }
    res.redirect("/")
})




app.listen(5000);
console.log('5000 is the magic port');


