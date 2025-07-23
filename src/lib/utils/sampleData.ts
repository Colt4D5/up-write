// Sample data generator for testing the activity grid
// This would typically be called from the dashboard load function during development

export function generateSampleActivityData() {
	const data = [];
	const today = new Date();
	
	// Generate data for the last 365 days with more realistic patterns
	for (let i = 0; i < 365; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);
		
		const dateStr = date.toISOString().split('T')[0];
		const dayOfWeek = date.getDay();
		
		// Higher chance of activity on weekdays, lower on weekends
		const weekdayFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.3 : 0.8;
		
		// Create some streaks and dry spells
		const streakFactor = Math.sin(i / 30) * 0.5 + 0.5; // Creates waves of activity
		
		// Random chance of activity based on factors
		if (Math.random() < weekdayFactor * streakFactor) {
			// Vary word count based on how active the period is
			let baseWords = 200;
			if (streakFactor > 0.7) baseWords = 800; // High activity periods
			else if (streakFactor > 0.4) baseWords = 500; // Medium activity
			
			const words = Math.floor(baseWords + (Math.random() * baseWords * 0.5));
			const sessions = Math.floor(Math.random() * 2) + 1; // 1-3 sessions
			
			data.push({
				date: dateStr,
				words,
				sessions
			});
		}
	}
	
	return data.sort((a, b) => a.date.localeCompare(b.date));
}
