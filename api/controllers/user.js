const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email already exist!'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            username: req.body.username,
                            password: hash,
                            userImage: req.file.path
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created!'
                                });
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length <1 ) {
                res.status(401).json({
                    message: 'Auth failed!'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed!'
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1y"
                        }
                    )
                    return res.status(200).json({
                        message: 'Auth successful!',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed!'
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.user_get_all = (req, res, next) => {
    User.find()
        // .select("_id name email username")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        email: doc.email,
                        username: doc.username,
                        phone: doc.phone,
                        country: doc.country,
                        userImage: doc.userImage,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/user/get/" + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_get_user = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('-password')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    user: doc,
                    request: {
                        type: 'GET',
                        url: "http://localhost:5000/user/"
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.user_update_user = (req, res, next) => {
    const id = req.params.userId;
    User.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Data updated!",
                request: {
                    type: 'GET',
                    url: "http://localhost:5000/user/get/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted!",
                request: {
                    type: 'POST',
                    url: "http://localhost:5000/user/signup",
                    body: {
                        email: 'String',
                        password: 'String'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}