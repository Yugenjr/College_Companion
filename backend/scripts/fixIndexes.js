import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: join(__dirname, '../.env') });

const fixIndexes = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const collection = mongoose.connection.collection('users');

        // List current indexes
        const indexes = await collection.indexes();
        console.log('📊 Current Indexes:', indexes.map(i => i.name));

        // Drop the problematic index 'email_1' if it exists
        try {
            const emailIndex = indexes.find(i => i.name === 'email_1');
            if (emailIndex) {
                console.log('🗑️  Dropping problematic index: email_1 ...');
                await collection.dropIndex('email_1');
                console.log('✅ Index dropped successfully.');
                console.log('ℹ️  The sparse index will be recreated automatically on server restart.');
            } else {
                console.log('ℹ️  Index email_1 not found (already fixed or never existed).');
            }
        } catch (err) {
            console.log('⚠️  Error dropping index:', err.message);
        }

        // Also check for profile.email_1 index
        try {
            const profileEmailIndex = indexes.find(i => i.name === 'profile.email_1');
            if (profileEmailIndex) {
                console.log('🗑️  Dropping index: profile.email_1 ...');
                await collection.dropIndex('profile.email_1');
                console.log('✅ Profile email index dropped.');
            }
        } catch (err) {
            console.log('⚠️  No profile.email index to drop:', err.message);
        }

        console.log('\n🏁 Done! You can now restart your server.');
        console.log('📝 The new sparse email index will be created automatically.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
};

fixIndexes();
