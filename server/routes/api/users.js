const express = require("express");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const router = express.Router();
const users = 'users';

// Connection URL
// const url = 'mongodb+srv://thabet3:sabeat5445894@cluster0-qntes.mongodb.net/test?retryWrites=true&w=majority';
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'home-list';

// Get All Users
router.get('/', async (req, res) => {
    const users = await loadUsersCollection();
    res.send(await users.find().toArray());
});

// Get User info
router.get('/:id', async (req, res) => {
    const users = await loadUsersCollection();
    res.send(await users.find({_id: new mongodb.ObjectID(req.params.id)}).toArray());
});

// Add User
router.post('/', async (req, res) => {
    const users = await loadUsersCollection();
    await users.insertOne({
        "name": req.body.name,
        "active": true,
        "company_id": req.body.company_id,
        "email": req.body.email,
        "colors": {
            "main": "indigo",
            "theme": "white",
            "second": "grey",
            "green": "green",
            "dark": "dark",
            "deepPurple": "deep-purple",
            "pink": "pink"
        },
        "filters": {
            "name": "",
            "date": {
                "menu": false,
                "dates": ["", ""],
                "cond": false
            },
            "complete": true,
            "price": false,
            "quantity": false,
            "importance": false
        },
        "dialogAddItem": {
            "dialog": false,
            "simple": false
        }
    });
    res.status(201).send();
});

// Delete User
router.delete('/:id', async (req, res) => {
    const users = await loadUsersCollection();
    await users.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});


async function loadUsersCollection() {
    const client = await MongoClient.connect(url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
    return client.db(dbName).collection(users);
}


module.exports = router;







