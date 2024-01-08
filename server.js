const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3100;
const cors = require('cors');


app.use(express.json());
app.use(cors({
    origin: 'https://hostproj-3f208.web.app',
}))


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri ='mongodb+srv://Slinger:cleanbandit1212@cluster0.g6kgz0u.mongodb.net/?retryWrites=true&w=majority';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('test').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/login', async (req, res) => {
  // Create a JWT token
  const token = jwt.sign({ userId: 'user_id' }, 'q5$28k3y');
  res.header('Access-Control-Allow-Origin', 'https://hostproj-3f208.web.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.send({ token });
});
// Middleware for validating JWT token
function validateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'q5$28k3y', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
app.get('/QAsGet',validateToken, async (req, res) => {
  try {
    // Check if the client is connected to the server
    await client.connect();
    await client.db('test').command({ ping: 1 });
    const testCollection = client.db().collection('surveyCollection');
    const quest = await testCollection.find({}).toArray();
    res.header('Access-Control-Allow-Origin', 'https://hostproj-3f208.web.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');

    res.send(quest);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});
app.get('/QAsGet/:id',validateToken, async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Check if the client is connected to the server
    await client.connect();
    await client.db('test').command({ ping: 1 });

    // Get a reference to the testCollection collection
    const testCollection = client.db().collection('surveyCollection');

    // Convert the id to ObjectId using 'new ObjectId()'
    const objectId = new ObjectId(id);

    // Perform the find operation based on the document's _id field
    const result = await testCollection.findOne({ _id: objectId });

    if (!result) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.header('Access-Control-Allow-Origin', 'https://hostproj-3f208.web.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).json({ message: 'Data retrieved successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving the data' });
  }
});
app.post('/QAsPost',validateToken, async (req, res) => {
  try {
    // Extract data from the request body
    const { questions, title } = req.body;
    await client.connect();
    await client.db('test').command({ ping: 1 });
    // Get a reference to the testCollection collection
    const testCollection = client.db().collection('surveyCollection');
    // Create a new document to insert
    const newDocument = {
      questions,
      title
    };
    // Insert the new document into the testCollection collection
    const result = await testCollection.insertOne(newDocument);
    res.header('Access-Control-Allow-Origin', 'https://hostproj-3f208.web.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');

    res.status(201).json({ message: 'Data inserted successfully', id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while inserting the data' });
  }
});
app.put('/QAsPut/:id',validateToken, async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Extract the data to be updated from the request body
    const { questions, title } = req.body;

    // Check if the client is connected to the server
    await client.connect();
    await client.db('test').command({ ping: 1 });

    // Get a reference to the testCollection collection
    const testCollection = client.db().collection('surveyCollection');

    // Create an updated document
    const updatedDocument = {
      questions,
      title
    };

    // Convert the id to ObjectId using 'new ObjectId()'
    const objectId = new ObjectId(id);

    // Perform the update operation based on the document's _id field
    const result = await testCollection.updateOne(
      { _id: objectId },
      { $set: updatedDocument }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.header('Access-Control-Allow-Origin', 'https://hostproj-3f208.web.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the data' });
  }
});

app.get('/ResGet/:token', async (req, res) => {
  try {
    // Extract the token from the request parameters
    const { token } = req.params;

    await client.connect();
    await client.db('test').command({ ping: 1 });

    // Get a reference to the surveyCollection collection
    const surveyCollection = client.db().collection('surveyResults');

    // Find all documents with the same assessorToken
    const results = await surveyCollection.find({ assessorToken: token }).toArray();
    res.header('Access-Control-Allow-Origin', 'https://hostproj-3f208.web.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).json({ message: 'Data retrieved successfully', data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving the data' });
  }
});

app.post('/ResPost', async (req, res) => {
  try {
    // Extract data from the request body
    const { questions, title, surveyId, assessorToken, assessedId } = req.body;
    await client.connect();
    await client.db('test').command({ ping: 1 });
    // Get a reference to the surveyCollection collection
    const surveyCollection = client.db().collection('surveyResults');
    // Create a new document to insert
    const newDocument = {
      title,
      questions,
      surveyId,
      assessorToken,
      assessedId
    };
    // Insert the new document into the surveyCollection collection
    const result = await surveyCollection.insertOne(newDocument);
    res.header('Access-Control-Allow-Origin', 'https://hostproj-3f208.web.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(201).json({ message: 'Data inserted successfully', id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while inserting the data' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
