const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const RankingCategory = require('./server/models/RankingCategory.model');
const AssetNominee = require('./server/models/AssetNominee.model');
const DealerNominee = require('./server/models/DealerNominee.model');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/otulia';

mongoose.connect(mongoUri)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        const categories = await RankingCategory.find({})
            .populate('assetNominees')
            .populate('dealerNominees');
            
        console.log(`Found ${categories.length} categories:`);
        categories.forEach(c => {
            const nominees = c.targetType === 'Assets' ? c.assetNominees : c.dealerNominees;
            const totalVotes = nominees.reduce((sum, n) => sum + (n.votes || 0), 0);
            console.log(`- Title: ${c.title}, Status: ${c.status}, Nominees Count: ${nominees.length}, Total Votes: ${totalVotes}`);
            nominees.forEach(n => {
                console.log(`  * Nominee Name: ${n.name}, Votes: ${n.votes}`);
            });
        });
        
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
