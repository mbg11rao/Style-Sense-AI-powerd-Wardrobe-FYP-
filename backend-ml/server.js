  const express = require('express')
  const cors = require('cors')
  const axios = require('axios');
  const { urlService, WEATHER_API_KEY, IMAGE_SECRETE } = require('./secrete')
  const { MongoClient, ObjectId } = require('mongodb')

  const webapp = express()
  webapp.use(cors())
  webapp.use(
    express.urlencoded({
      extended: true
    })
  )
  webapp.use(express.json())

  const port = 8000

  webapp.get('/', (req, res) => {
    res.send('Hello World!')
  })

  webapp.get('/clothes', async (req, res) => {
    // Connect to MongoDB
    const client = new MongoClient(urlService)

    try {
      await client.connect()

      // Access the MongoDB collection where you stored the clothing data
      const collection = client.db  ('StyleSense').collection('Closet'); // Replace with your collection name.

      // Query for all clothing items in the collection
      const allClothingItems = await collection.find({}).sort({ "time": -1 }).toArray()

      if (allClothingItems.length > 0) {
        res.json(allClothingItems)
      } else {
        res.status(404).json({ message: 'No clothing items found.' })
      }
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    } finally {
      client.close()
    }
  })

  webapp.get('/clothes/type/:type/activity/:activity', async (req, res) => {
    const clothingType = req.params.type.toLowerCase()
    const activity = req.params.activity.toLowerCase()
    // Connect to MongoDB
    const client = new MongoClient(urlService)

    try {
      await client.connect()

      // Access the MongoDB collection where you stored the clothing data
      const collection = client.db  ('StyleSense').collection('Closet'); // Replace with your collection name.

      // Define the query object based on type and activity
      const query = {}

      if (clothingType !== 'all' && clothingType !== 'null') {
        query.type = clothingType
      }

      if (activity !== 'all' && activity !== 'null') {
        query.event = activity
      }

      // Query for clothing items matching the type and activity
      const matchingClothes = await collection.find(query).sort({ "time": -1 }).toArray()
      res.json({ data: matchingClothes })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    } finally {
      client.close()
    }
  })

  webapp.get('/recommend/addCloth/:id', async (req, res) => {
    const clothingId = req.params.id;

    // Connect to MongoDB
    const client = new MongoClient(urlService);

    try {
      await client.connect();

      const clothesCollection = client.db  ('StyleSense').collection('Closet');;

      const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const result = await clothesCollection.updateOne(
        { _id: new ObjectId(clothingId) },
        { $set: { time: currentTime } }
      );

      if (result.modifiedCount === 1) {
        res.json({ message: 'Clothing item added to the event outfit' });
      } else {
        res.status(500).json({ message: 'Failed to update the outfit' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  })

  webapp.get('/recommend/clothes/type/:type/activity/:activity', async (req, res) => {
    const clothingType = req.params.type.toLowerCase()
    const activity = req.params.activity.toLowerCase()
    // Connect to MongoDB
    const client = new MongoClient(urlService)

    try {
      await client.connect()

      // Access the MongoDB collection where you stored the clothing data
      const collection = client.db  ('StyleSense').collection('Closet'); // Replace with your collection name.

      // Define the query object based on type and activity
      const query = {}

      if (clothingType !== 'all' && clothingType !== 'null') {
        query.type = clothingType
      }

      if (activity !== 'all' && activity !== 'null') {
        query.event = activity
      }

      // Query for clothing items matching the type and activity
      const matchingClothes = await collection.find(query).sort({ "time": -1 }).toArray()
      res.json({ data: matchingClothes })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    } finally {
      client.close()
    }
  })

  webapp.get('/outfit/activity/:activity/date/:date', async (req, res) => {
    // Extract year, month, and day from the string
    const year = req.params.date.slice(0, 4);
    const month = req.params.date.slice(4, 6) - 1; // Adjust month (0-11)
    const day = req.params.date.slice(6, 8);
    // Create a new Date object
    const currentDate = new Date(year, month, day);
    const eventType = req.params.activity.toLowerCase();

    // Connect to MongoDB
    const client = new MongoClient(urlService);

    try {
      await client.connect();

      // Access the 'outfits' collection in the database
      const collection = client.db('StyleSense').collection('outfits'); // Replace with your collection name.
      const clothesCollection = client.db  ('StyleSense').collection('Closet');;

      const top = await clothesCollection.aggregate([
        { $match: { event: eventType, type: 'top' } },
        { $sample: { size: 1 } }
      ]).toArray();

      const bottom = await clothesCollection.aggregate([
        { $match: { event: eventType, type: 'bottom' } },
        { $sample: { size: 1 } }
      ]).toArray();


      const activityData = {
        date: currentDate,
        event: eventType,
        outfits: [],
      };

      if (top.length === 1) {
        activityData.outfits.push(top[0]._id);
      }
      if (bottom.length === 1) {
        activityData.outfits.push(bottom[0]._id);
      }
      // Insert the new activity data into the 'outfits' collection
      const result = await collection.insertOne(activityData);

      res.json({ message: 'Activity added successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  });

  webapp.get('/outfit/date/:date', async (req, res) => {
    // Extract year, month, and day from the string
    const year = req.params.date.slice(0, 4);
    const month = req.params.date.slice(4, 6) - 1; // Adjust month (0-11)
    const day = req.params.date.slice(6, 8);
    // Create a new Date object
    const date = new Date(year, month, day);
    // Define the time range for the specified date
    const begin = new Date(date);
    begin.setHours(0, 0, 0, 0); // Start of the specified date
    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // End of the specified date
    console.log('getting outfit on date', begin, end)
    // Connect to MongoDB
    const client = new MongoClient(urlService);

    try {
      await client.connect();

      // Access the 'outfits' collection in the database
      const collection = client.db('StyleSense').collection('outfits'); // Replace with your collection name.

      // Query for outfits for the specified date
      const outfitsForDate = await collection
        .find({
          date: {
            $gte: begin,
            $lt: end,
          },
        })
        .toArray();
      res.json({ data: outfitsForDate });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  });

  webapp.get('/outfit/delete/:id', async (req, res) => {
    const outfitId = req.params.id;

    // Connect to MongoDB
    const client = new MongoClient(urlService);

    try {
      await client.connect();

      // Access the 'outfits' collection in the database
      const collection = client.db('StyleSense').collection('outfits'); // Replace with your collection name.

      // Delete the outfit by its MongoDB ObjectId
      const result = await collection.deleteOne({ _id: new ObjectId(outfitId) });

      res.json({ message: 'Outfit deleted successfully' });

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  });

  // done
  webapp.get('/outfit/addCloth/:id/event/:event/date/:date', async (req, res) => {
    const clothingId = req.params.id;
    let event;
    if (req.params.event === 'null') {
      event = 'causal';
    } else {
      event = req.params.event;
    }
    let date;
    if (req.params.date === 'null') {
      date = new Date()
    }
    else {  // Extract year, month, and day from the string
      const year = req.params.date.slice(0, 4);
      const month = req.params.date.slice(4, 6) - 1; // Adjust month (0-11)
      const day = req.params.date.slice(6, 8);
      // Create a new Date object
      date = new Date(year, month, day);
    }
    // Define the time range for the specified date
    const begin = new Date(date);
    begin.setHours(0, 0, 0, 0); // Start of the specified date
    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // End of the specified date

    // Connect to MongoDB
    const client = new MongoClient(urlService);

    try {
      await client.connect();

      // Access the 'outfits' collection in the database
      const collection = client.db('StyleSense').collection('outfits'); // Replace with your collection name.

      // Find the document with the specified event
      const outfitDocument = await collection.findOne({
        event: event,
        date: { $gte: begin, $lte: end }
      });
      if (outfitDocument) {
        //const string id to mongddb id 
        const clothingIdMogo = new ObjectId(clothingId);
        // Append the clothingId to the 'outfits' array
        outfitDocument.outfits.push(clothingIdMogo);

        // Update the document in the collection
        const result = await collection.updateOne(
          { _id: outfitDocument._id }, // Update based on the retrieved document's _id
          { $set: { outfits: outfitDocument.outfits } }
        );

        if (result.modifiedCount === 1) {
          res.json({ message: 'Clothing item added to the event outfit' });
        } else {
          res.status(500).json({ message: 'Failed to update the outfit' });
        }
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  });
  ;

  webapp.get('/clothes/:id', async (req, res) => {
    const clothingId = req.params.id;

    // Connect to MongoDB
    const client = new MongoClient(urlService);

    try {
      await client.connect();

      // Access the 'clothes' collection in the database
      const collection = client.db  ('StyleSense').collection('Closet');; // Replace with your collection name.

      // Find the clothing item by its id
      const clothingItem = await collection.findOne({ _id: new ObjectId(clothingId) });

      if (clothingItem) {
        res.json({ data: clothingItem });
      } else {
        res.status(404).json({ message: 'Clothing item not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  });

  // done
  webapp.get('/outfits/remove/event/:event/id/:id/date/:date', async (req, res) => {
    let date;
    if (req.params.date === 'null') {
      date = new Date()
    }
    else {  // Extract year, month, and day from the string
      const year = req.params.date.slice(0, 4);
      const month = req.params.date.slice(4, 6) - 1; // Adjust month (0-11)
      const day = req.params.date.slice(6, 8);
      // Create a new Date object
      date = new Date(year, month, day);
    }
    // Define the time range for the specified date
    const begin = new Date(date);
    begin.setHours(0, 0, 0, 0); // Start of the specified date
    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // End of the specified date


    const event = req.params.event;
    const clothingId = req.params.id;
    const client = new MongoClient(urlService);

    try {
      await client.connect();

      // Access the 'outfits' collection in the database
      const collection = client.db('StyleSense').collection('outfits'); // Replace with your collection name.

      // Find the document with the specified event
      const outfitDocument = await collection.findOne({
        event: event,
        date: { $gte: begin, $lte: end }
      });

      if (outfitDocument) {
        // Remove the specified clothingId from the 'outfits' array
        const updatedOutfits = outfitDocument.outfits.filter(id => id.toString() !== clothingId);

        // Update the document in the collection
        const result = await collection.updateOne(
          { _id: outfitDocument._id },
          { $set: { outfits: updatedOutfits } }
        );

        if (result.modifiedCount === 1) {
          res.json({ message: 'Clothing item removed from the event outfit' });
        } else {
          res.status(500).json({ message: 'Failed to update the outfit' });
        }
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  });

  
  webapp.get('/outfits/regenerate/event/:event/id/:id/date/:date', async (req, res) => {
    // Extract year, month, and day from the string
    const year = req.params.date.slice(0, 4);
    const month = req.params.date.slice(4, 6) - 1; // Adjust month (0-11)
    const day = req.params.date.slice(6, 8);
    // Create a new Date object
    const date = new Date(year, month, day);
    // Define the time range for the specified date
    const begin = new Date(date);
    begin.setHours(0, 0, 0, 0); // Start of the specified date
    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // End of the specified date

    const event = req.params.event;
    const clothingId = new ObjectId(req.params.id);
    // Connect to MongoDB
    const client = new MongoClient(urlService);

    try {
      await client.connect();

      const outfitsCollection = client.db('StyleSense').collection('outfits');
      const clothesCollection = client.db  ('StyleSense').collection('Closet');;

      // Find the document with the specified event
      const outfitDocument = await outfitsCollection.findOne({
        event: event,
        date: { $gte: begin, $lte: end }
      });

      const thisClothMeta = await clothesCollection.findOne({
        _id: clothingId
      });

      if (outfitDocument) {
        const clothingToReplace = outfitDocument.outfits.findIndex((element) => element.equals(clothingId));

        if (clothingToReplace !== -1) {
          // Find clothing items of the same event and clothing type
          const clothingItem = await clothesCollection.aggregate([
            { $match: { event: event, type: thisClothMeta['type'] } },
            { $sample: { size: 1 } }
          ]).toArray();

          if (clothingItem.length === 1) {
            // Replace the clothing item
            outfitDocument.outfits.splice(clothingToReplace, 1, clothingItem[0]._id);

            // Update the document in the collection
            const result = await outfitsCollection.updateOne(
              { _id: outfitDocument._id }, // Update based on the retrieved document's _id
              { $set: { outfits: outfitDocument.outfits } }
            );
            if (result.modifiedCount === 1) {
              res.json({ message: 'Clothing item regenerated successfully', data: outfitDocument.outfits[0] });
            } else {
              res.status(500).json({ message: 'Failed to update the outfit' });
            }
          } else {
            res.status(404).json({ message: 'No matching clothing item found to replace' });
          }
        } else {
          res.status(404).json({ message: 'Clothing item to replace not found in the outfit' });
        }
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  });


  webapp.get('/getWeather', async (req, res) => {
    try {
      const location = `http://pro.openweathermap.org/data/2.5/weather?q=Philadelphia&units=imperial&appid=${WEATHER_API_KEY}`;
      const result = await axios.get(location);
      res.json({ data: result.data });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  webapp.get('/getWeatherForDate/date/:date', async (req, res) => {
    try {
      const dateCode = req.params.date;
      const location = `https://history.openweathermap.org/data/2.5/history/city?q=Philadelphia&appid=${WEATHER_API_KEY}&units=imperial&dt=${dateCode}`;
      const result = await axios.get(location);
      res.json({ data: result.data });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  const cloudinary = require("cloudinary").v2

  const cloudinaryConfig = cloudinary.config({
    cloud_name: "dattvkl8s",
    api_key: "231963133881842",
    api_secret: IMAGE_SECRETE,
    secure: true
  })

  webapp.get("/get-signature", (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp
      },
      cloudinaryConfig.api_secret
    )
    res.json({ timestamp, signature })
  })



const client = new MongoClient(urlService);

webapp.post('/uploadImage', async (req, res) => {
    console.log("Received body for image upload:", req.body);

    try {
        const collection = client.db('StyleSense').collection('Closet');
        const imageUrl = req.body.imageUrl; // This is your Cloudinary URL
        console.log("sending request to flask server:");

        // Make a POST request to your Flask server for classification
        const flaskResponse = await axios.post(`http://127.0.0.1:5000/classify-image`, { imageUrl: imageUrl });
        const classificationResults = flaskResponse.data; // Data from your Flask server
        console.log("request came back:");

        let recommended_bottom_color1, recommended_shoes_color1;
        if (req.body.type === 'top' || req.body.type === 'outwear') {
            recommended_bottom_color1 = classificationResults.recommended_bottom_color1;
            recommended_shoes_color1 = classificationResults.recommended_shoes_color1;
        } else {
            recommended_bottom_color1 = "Recommended colour is only for top or outwear";
            recommended_shoes_color1= "Recommended colour is only for top or outwear";
        }

        let recommended_bottom_color2, recommended_shoes_color2;
        if (req.body.type === 'top' || req.body.type === 'outwear') {
          recommended_bottom_color2 = classificationResults.recommended_bottom_color2;
          recommended_shoes_color2 = classificationResults.recommended_shoes_color2;
      } else {
          recommended_bottom_color2 = "Recommended colour is only for top or outwear";
          recommended_shoes_color2 = "Recommended colour is only for top or outwear";
      }
        console.log("sending data to mongodb:", mongoID);

        const document = {
            image_url: imageUrl, // Cloudinary URL
            brand_name: req.body.brand_names || "Self-taken",
            description: req.body.descriptions || "A cloth taken",
            event: req.body.event || 'defaultEvent',
            type: req.body.type || 'defaultType',
            time: req.body.time,
            classification_subtype: classificationResults.classification_subtype,
            classification_info: classificationResults.classification_info,
            color_info: classificationResults.color_info,

            recommended_bottom_color_fromM1: recommended_bottom_color1,
            recommended_shoes_color_fromM1: recommended_shoes_color1,



            integrated_classification_label: classificationResults.integrated_classification_label,
            integrated_dominant_color: classificationResults.integrated_dominant_color,
            combined_label_and_color: classificationResults.combined_label_and_color,

            recommended_bottom_color_fromM2: recommended_bottom_color2,
            recommended_shoes_color_fromM2: recommended_shoes_color2,

        };
        console.log("after creating document:");

        await collection.insertOne(document);
        console.log("data inserted successfully");

        res.json(document);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

  webapp.get('/clothes/delete/:id', async (req, res) => {
    const mongoId = req.params.id;

    const client = new MongoClient(urlService);

    try {
      await client.connect();

      const collection = client.db  ('StyleSense').collection('Closet');; // Replace with your collection name.

      const result = await collection.deleteOne({ _id: new ObjectId(mongoId) });

      res.json({ message: 'Cloth deleted successfully' });

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  });



  webapp.get('/clothes/edit/:id/event/:event/type/:type', async (req, res) => {
    const mongoID = req.params.id;
    const newEvent = req.params.event;
    const newType = req.params.type;
    const client = new MongoClient(urlService);

    try {
      await client.connect();

      const collection = client.db  ('StyleSense').collection('Closet');;

      const result = await collection.updateOne(
        { _id: new ObjectId(mongoID) },
        { $set: { event: newEvent, type: newType } }
      );

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }

  });


  webapp.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
