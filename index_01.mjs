import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import express from "express"
dotenv.config()
// Replace the uri string with your connection string.
// console.log(process.env)
// const uri = "mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&w=majority";
const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;
const uri =
    `mongodb+srv://${db_username}:${db_password}@${db_url}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const app = express();
app.set('port', process.env.PORT || 3000);
app.get('/findOne', async (req,res) => {
    try {
        const database = client.db('sample_airbnb');
        const airbnb_database = database.collection('listingsAndReviews');
        // Query for airbnb listings that are apartments
        for (const key in req.query) {
            if (key === "bedrooms" || key === "beds") {
                req.query[key] = parseInt(req.query[key])
            } else if(req.query[key] == null) {
                delete req.query[key]
            }
        }
        const filter = req.query;
        console.log(filter)
        const projection = { "listing_url": 1, "name": 1, "summary": 1, "property_type" : 1, "bedrooms": 1, "beds": 1};
        const airbnb = await airbnb_database.findOne(filter, { projection: projection });
        console.log(airbnb);
        res.type('json');
        res.status(200);
        res.json({
            airbnb: airbnb
        });
    } catch (error) {
        console.log(error)
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

});
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});
app.listen(app.get('port'), () => {
    console.log('Express started');
});