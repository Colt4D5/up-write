<script lang="ts">
	// Simple footer component - no props needed
</script>

<footer class="bg-white border-t border-gray-200 mt-auto">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
			<div class="flex items-center space-x-4">
				<p class="text-sm text-gray-600">
					© {new Date().getFullYear()} WriterBuddy. Made for writers, by writers.
				</p>
			</div>
			
			<div class="flex items-center space-x-6">
				<a href="/about" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
					About
				</a>
				<a href="/help" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
					Help
				</a>
				<a href="/privacy" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
					Privacy
				</a>
			</div>
		</div>
	</div>
</footer>
