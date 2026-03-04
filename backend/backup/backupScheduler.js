import schedule from 'node-schedule';
import { backupCollections } from './backupService.js';

// Schedule full backup every day at 2am
schedule.scheduleJob('0 2 * * *', async () => {
  try {
    const fileName = await backupCollections({ type: 'full', timestamp: new Date() });
    console.log(`✅ Daily full backup created: ${fileName}`);
  } catch (error) {
    console.error('❌ Daily backup failed:', error.message);
  }
});

// Schedule incremental backup every hour
schedule.scheduleJob('0 * * * *', async () => {
  try {
    const fileName = await backupCollections({ type: 'incremental', timestamp: new Date() });
    console.log(`✅ Hourly incremental backup created: ${fileName}`);
  } catch (error) {
    console.error('❌ Incremental backup failed:', error.message);
  }
});

export default {};
