const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri =
  "mongodb+srv://Enest:Enest1@enest.nf5qc.mongodb.net/?retryWrites=true&w=majority&appName=Enest"; // Change if needed
const client = new MongoClient(uri);

async function exportAllCollections() {
  try {
    await client.connect();
    const db = client.db("test"); // Change to your DB name

    // Get all collection names
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log("No collections found in the database.");
      return;
    }

    // Create an "exports" folder if it doesn't exist
    const exportDir = path.join(__dirname, "exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // Loop through each collection and export data
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);

      const data = await collection.find({}).toArray();
      const filePath = path.join(exportDir, `${collectionName}.json`);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      console.log(`Exported ${collectionName} to ${filePath}`);
    }

    console.log("All collections exported successfully!");
  } catch (error) {
    console.error("Error exporting collections:", error);
  } finally {
    await client.close();
  }
}

exportAllCollections();
