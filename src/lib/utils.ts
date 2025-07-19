import { nanoid } from 'nanoid';

export function generateId(): string {
	return nanoid();
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString();
}

export function formatDateTime(date: Date): string {
	return date.toLocaleString();
}

export function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function formatWordCount(count: number): string {
	if (count >= 1000000) {
		return `${(count / 1000000).toFixed(1)}M`;
	} else if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}K`;
	}
	return count.toString();
}

export function calculateReadingTime(wordCount: number): number {
	// Average reading speed is about 250 words per minute
	return Math.ceil(wordCount / 250);
}

export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + '...';
}

export function getProjectStatusColor(status: string): string {
	switch (status) {
		case 'draft':
			return 'text-gray-500';
		case 'in_progress':
			return 'text-blue-500';
		case 'completed':
			return 'text-green-500';
		case 'published':
			return 'text-purple-500';
		default:
			return 'text-gray-500';
	}
}

export function getSuggestionSeverityColor(severity: string): string {
	switch (severity) {
		case 'low':
			return 'text-yellow-500';
		case 'medium':
			return 'text-orange-500';
		case 'high':
			return 'text-red-500';
		default:
			return 'text-gray-500';
	}
}

export function calculateAge(birthday: string): number | null {
	if (!birthday) return null;
	
	const birthDate = new Date(birthday);
	const today = new Date();
	
	// Check if the birthday is valid
	if (isNaN(birthDate.getTime())) return null;
	
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	
	return age;
}

export function formatBirthday(birthday: string): string {
	if (!birthday) return '';
	const date = new Date(birthday);
	return date.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	});
}
