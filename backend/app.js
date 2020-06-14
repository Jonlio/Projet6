//Importations
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require("path");

//Création de l'app express
const app = express();

//Importation des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Connexion MongoDB
mongoose.connect('mongodb+srv://Jonli0:1WxOnQqeWvOGuL64@clusterjo-0we1s.mongodb.net/SoPeckocko?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Authorisations requetes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Gestion données reçues
app.use(bodyParser.json());

//Gestion images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
