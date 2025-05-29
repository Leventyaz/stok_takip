import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const { id } = req.query;

    // ID formatını kontrol et
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Geçersiz stok ID formatı' });
    }

    try {
        const { db } = await connectToDatabase();
        
        if (req.method === 'GET') {
            const stok = await db.collection('stoklar').findOne({ _id: new ObjectId(id) });
            
            if (!stok) {
                return res.status(404).json({ message: 'Stok bulunamadı' });
            }
            
            return res.status(200).json(stok);
        }
        
        if (req.method === 'PUT') {
            const { ad, kategori, miktar, fiyat } = req.body;
            
            if (!ad || !kategori || miktar === undefined || fiyat === undefined) {
                return res.status(400).json({ message: 'Eksik veya hatalı bilgi' });
            }

            const result = await db.collection('stoklar').updateOne(
                { _id: new ObjectId(id) },
                { $set: { ad, kategori, miktar, fiyat } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Stok bulunamadı' });
            }

            return res.status(200).json({ message: 'Stok güncellendi' });
        }
        
        if (req.method === 'DELETE') {
            const result = await db.collection('stoklar').deleteOne({ _id: new ObjectId(id) });
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Stok bulunamadı' });
            }
            
            return res.status(200).json({ message: 'Stok silindi' });
        }

        return res.status(405).json({ message: 'Desteklenmeyen metod' });
        
    } catch (error) {
        console.error('Stok işlemi hatası:', error);
        return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
} 