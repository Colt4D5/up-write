/**
 * Writing session tracker
 * Tracks time spent writing and words written, then sends data to server
 */
export class WritingSessionTracker {
	private projectId: string;
	private startTime: number = 0;
	private lastWordCount: number = 0;
	private isActive: boolean = false;
	private sessionTimeout: number | null = null;
	private inactivityTimeout: number | null = null;
	
	// Configuration
	private readonly INACTIVITY_THRESHOLD = 60000; // 1 minute of inactivity ends session
	private readonly MIN_SESSION_DURATION = 30000; // Minimum 30 seconds to count as session
	private readonly AUTOSAVE_INTERVAL = 60000; // Save session data every minute

	constructor(projectId: string) {
		this.projectId = projectId;
	}

	/**
	 * Start tracking a writing session
	 */
	start(initialWordCount: number = 0): void {
		if (this.isActive) return;
		
		this.startTime = Date.now();
		this.lastWordCount = initialWordCount;
		this.isActive = true;
		
		// Set up autosave interval
		this.sessionTimeout = window.setInterval(() => {
			this.saveSession();
		}, this.AUTOSAVE_INTERVAL);

		console.log('Writing session started');
	}

	/**
	 * Update session with current word count
	 */
	updateActivity(currentWordCount: number): void {
		if (!this.isActive) return;

		// Reset inactivity timer
		if (this.inactivityTimeout) {
			clearTimeout(this.inactivityTimeout);
		}

		// Set new inactivity timer
		this.inactivityTimeout = window.setTimeout(() => {
			this.end();
		}, this.INACTIVITY_THRESHOLD);
		
		this.lastWordCount = currentWordCount;
	}

	/**
	 * End the writing session and save data
	 */
	async end(): Promise<void> {
		if (!this.isActive) return;

		const sessionDuration = Date.now() - this.startTime;
		
		// Only save if session was long enough
		if (sessionDuration >= this.MIN_SESSION_DURATION) {
			await this.saveSession();
		}

		this.cleanup();
		console.log('Writing session ended');
	}

	/**
	 * Save session data to server
	 */
	private async saveSession(): Promise<void> {
		if (!this.isActive) return;

		const timeSpentMinutes = Math.round((Date.now() - this.startTime) / 60000);
		const wordsWritten = Math.max(0, this.lastWordCount); // Ensure non-negative

		if (timeSpentMinutes < 1) return; // Don't save sessions less than 1 minute

		try {
			const response = await fetch('/api/writing-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					projectId: this.projectId,
					wordsWritten,
					timeSpent: timeSpentMinutes
				})
			});

			if (!response.ok) {
				throw new Error(`Failed to save session: ${response.statusText}`);
			}

			console.log(`Saved writing session: ${timeSpentMinutes}min, ${wordsWritten} words`);
		} catch (error) {
			console.error('Error saving writing session:', error);
		}
	}

	/**
	 * Clean up timers and reset state
	 */
	private cleanup(): void {
		this.isActive = false;
		
		if (this.sessionTimeout) {
			clearInterval(this.sessionTimeout);
			this.sessionTimeout = null;
		}
		
		if (this.inactivityTimeout) {
			clearTimeout(this.inactivityTimeout);
			this.inactivityTimeout = null;
		}
	}

	/**
	 * Check if session is currently active
	 */
	get active(): boolean {
		return this.isActive;
	}

	/**
	 * Get current session duration in minutes
	 */
	get duration(): number {
		if (!this.isActive) return 0;
		return Math.round((Date.now() - this.startTime) / 60000);
	}

	/**
	 * Destroy the tracker and clean up
	 */
	destroy(): void {
		if (this.isActive) {
			this.end();
		}
		this.cleanup();
	}
}
