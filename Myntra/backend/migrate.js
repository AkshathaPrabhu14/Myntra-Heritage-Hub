const { MongoClient } = require("mongodb");

const localUri = "mongodb://127.0.0.1:27017";

const atlasUri =
    "mongodb+srv://akshathap789_db_user:Myntra12345@cluster0.13vikio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const dbName = "myntra_heritage";

async function migrate() {
    const localClient = new MongoClient(localUri);
    const atlasClient = new MongoClient(atlasUri);

    try {
        await localClient.connect();
        await atlasClient.connect();

        console.log("✅ Connected to Local MongoDB");
        console.log("✅ Connected to MongoDB Atlas");

        const localDB = localClient.db(dbName);
        const atlasDB = atlasClient.db(dbName);

        const collections = ["products", "users", "orders"];

        for (const collectionName of collections) {
            const localCollection = localDB.collection(collectionName);
            const atlasCollection = atlasDB.collection(collectionName);

            const docs = await localCollection.find({}).toArray();

            if (docs.length === 0) {
                console.log(`⚠️ ${collectionName} is empty`);
                continue;
            }

            // Remove existing data in Atlas
            await atlasCollection.deleteMany({});

            // Copy data
            await atlasCollection.insertMany(docs);

            console.log(`✅ Migrated ${docs.length} documents to ${collectionName}`);
        }

        console.log("\n🎉 Migration completed successfully!");
    } catch (err) {
        console.error(err);
    } finally {
        await localClient.close();
        await atlasClient.close();
    }
}

migrate();