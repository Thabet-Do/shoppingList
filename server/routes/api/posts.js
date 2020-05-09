const express = require("express");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const router = express.Router();
const posts = 'items';

// Connection URL
// const url = 'mongodb+srv://thabet3:sabeat5445894@cluster0-qntes.mongodb.net/test?retryWrites=true&w=majority';
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'home-list';

// Get All Items
router.get('/:company_id', async (req, res) => {
    const items = await loadPostsCollection();
    res.send(await items.find({"company_id": new mongodb.ObjectID(req.params.company_id)}).toArray());
});

// Add item
router.post('/', async (req, res) => {
    const items = await loadPostsCollection();
    await items.insertOne({
        "name": req.body.name,
        "quantity": req.body.quantity,
        "unit": req.body.unit,
        "price": req.body.price,
        "dateModify": new Date(),
        "dateCreate": new Date(),
        "description": req.body.description,
        "complete": true,
        "importance": req.body.importance,
        "user_id": new mongodb.ObjectID(req.body.user_id),
        "company_id": new mongodb.ObjectID(req.body.company_id),
    });
    res.status(201).send();
});

// Delete item
router.delete('/:id', async (req, res) => {
    const items = await loadPostsCollection();
    await items.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});


async function loadPostsCollection() {
    const client = await MongoClient.connect(url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
    return client.db(dbName).collection(posts);
}

// update item
router.put('/', async (req, res) => {
    // console.log(req.body);
    const items = await loadPostsCollection();
    await items.updateOne(
        {_id: new mongodb.ObjectID(req.body.id)},
        {
            $set: Object.assign(
                req.body.update,
                {
                    "user_id": new mongodb.ObjectID(req.body.user_id),
                    "dateModify": new Date(),
                })
        }
    );
    res.status(200).send();
});

module.exports = router;







