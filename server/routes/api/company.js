const express = require("express");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const router = express.Router();
const company = 'company';

// Connection URL
// const url = 'mongodb+srv://thabet3:sabeat5445894@cluster0-qntes.mongodb.net/test?retryWrites=true&w=majority';
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'home-list';

// Get All company
router.get('/', async (req, res) => {
    const company = await loadCompanyCollection();
    res.send(await company.find().toArray());
});

// Get company
router.get('/:id', async (req, res) => {
    const company = await loadCompanyCollection();
    res.send(await company.find({_id: new mongodb.ObjectID(req.params.id)}).toArray());
});

// Add company
router.post('/', async (req, res) => {
    const company = await loadCompanyCollection();
    await company.insertOne({
        "name": req.body.name,
        "active": true,
        "users_id": [new mongodb.ObjectID(req.body.user_id)]
    });
    res.status(201).send();
});

// Delete company
router.delete('/:id', async (req, res) => {
    const company = await loadCompanyCollection();
    await company.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});


async function loadCompanyCollection() {
    const client = await MongoClient.connect(url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
    return client.db(dbName).collection(company);
}


module.exports = router;







