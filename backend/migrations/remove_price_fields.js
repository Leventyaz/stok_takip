const { MongoClient } = require('mongodb');
require('dotenv').config();

async function removePriceFields() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('MongoDB bağlantısı başarılı');

        const db = client.db('stok_takip');
        
        // Stok koleksiyonundan fiyat alanını kaldır
        const result = await db.collection('stoks').updateMany(
            {},
            { $unset: { fiyat: "" } }
        );

        console.log(`${result.modifiedCount} kayıt güncellendi`);

    } catch (error) {
        console.error('Migration hatası:', error);
    } finally {
        await client.close();
        console.log('MongoDB bağlantısı kapatıldı');
    }
}

removePriceFields().catch(console.error); 