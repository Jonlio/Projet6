const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const config = require('../config/auth.config');

//Inscription utilisateur
exports.signup = (req, res, next) => {
    const securMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!securMail.test(req.body.email)) {
        return res.status(400).json({ message: 'Format Email invalide'});
    } 
    else if (req.body.password.length < 7) {
        return res.status(400).json({ message: 'Le MDP doit contenir 7 caractères minimum'});
    } else {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({ email: req.body.email, password: hash });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé!' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }))
    };
};

//Connexion utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé!' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect!' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({
                                userId: user._id
                            },
                            config.secret, {
                                expiresIn: '24h'
                            })
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


//Refacto ASYNC/AWAIT
/*
//Inscription utilisateur
exports.signup = async (req, res, next) => {
    if (!regex.test(req.body.email)) {
        res.status(400).json({
            message: 'Format Email invalide'
        });
    }
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash
        });
        await user.save();
        res.status(201).json({
            message: 'Utilisateur créé !'
        })
    } catch (err) {
        res.status(500).json({
            error
        })
    }
};

//Connexion utilisateur
exports.login = async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    })
    if (!user) {
        res.status(401).json({
            message: 'Utilisateur non trouvé!'
        });
    }
    try {
        await bcrypt.compare(req.body.password, user.password);
        res.status(200).json({
            userId: user._id,
            token: jwt.sign({
                userId: user._id
            }, config.secret, {
                expiresIn: '24h'
            })
        });
    } catch (err) {
        res.status(500).json({
            error
        })
    }
}
*/