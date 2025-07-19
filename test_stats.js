// Quick test of statistics service
import { StatisticsService } from './src/lib/server/services.js';

const userId = 'qtnnhuhvv4h26zvocaqam2i6'; // test user from database

try {
	console.log('Testing StatisticsService...');
	const stats = await StatisticsService.getUserWritingStatistics(userId);
	console.log('Statistics result:', stats);
} catch (error) {
	console.error('Error:', error);
}
