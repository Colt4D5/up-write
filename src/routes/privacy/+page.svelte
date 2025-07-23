<script lang="ts">
	import { Shield, Lock, Eye, UserCheck, Database, Globe, Mail, AlertTriangle } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Privacy Policy - WriterBuddy</title>
	<meta name="description" content="WriterBuddy's Privacy Policy - Learn how we protect your creative work and personal information." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<!-- Header -->
	<div class="text-center mb-12">
		<Shield class="h-16 w-16 text-blue-600 mx-auto mb-6" />
		<h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
		<p class="text-lg text-gray-600 max-w-2xl mx-auto">
			Your privacy and the security of your creative work are fundamental to everything we do at WriterBuddy.
		</p>
		<p class="text-sm text-gray-500 mt-4">Last updated: July 22, 2025</p>
	</div>

	<!-- Quick Summary -->
	<div class="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12">
		<h2 class="text-xl font-semibold text-blue-900 mb-4 flex items-center">
			<Eye class="h-5 w-5 mr-2" />
			Privacy at a Glance
		</h2>
		<ul class="space-y-2 text-blue-800">
			<li class="flex items-start">
				<span class="text-blue-600 mr-2">•</span>
				We never sell your personal data or creative work to third parties
			</li>
			<li class="flex items-start">
				<span class="text-blue-600 mr-2">•</span>
				Your writing content is encrypted and only accessible to you
			</li>
			<li class="flex items-start">
				<span class="text-blue-600 mr-2">•</span>
				You control what information is shared with friends and the community
			</li>
			<li class="flex items-start">
				<span class="text-blue-600 mr-2">•</span>
				We use minimal cookies and tracking, only for essential functionality
			</li>
			<li class="flex items-start">
				<span class="text-blue-600 mr-2">•</span>
				You can export or delete your data at any time
			</li>
		</ul>
	</div>

	<div class="prose prose-lg max-w-none">
		<!-- Information We Collect -->
		<section class="mb-12">
			<div class="flex items-center mb-6">
				<Database class="h-6 w-6 text-gray-600 mr-3" />
				<h2 class="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
			</div>
			
			<h3 class="text-xl font-semibold text-gray-900 mb-3">Account Information</h3>
			<p class="text-gray-700 mb-4">
				When you create an account, we collect your email address, username, and password (which is securely hashed). 
				You may optionally provide a display name, profile picture, and bio.
			</p>

			<h3 class="text-xl font-semibold text-gray-900 mb-3">Creative Content</h3>
			<p class="text-gray-700 mb-4">
				Your writing projects, documents, notes, and related metadata are stored securely on our servers. 
				This content is encrypted at rest and in transit, and is only accessible to you unless you explicitly 
				choose to share it.
			</p>

			<h3 class="text-xl font-semibold text-gray-900 mb-3">Usage Data</h3>
			<p class="text-gray-700 mb-4">
				We collect anonymous usage statistics to improve our platform, including word counts written, 
				features used, and general engagement patterns. This data cannot be traced back to individual users.
			</p>

			<h3 class="text-xl font-semibold text-gray-900 mb-3">Communication Data</h3>
			<p class="text-gray-700 mb-4">
				When you contact our support team or participate in community features, we store the content 
				of those communications to provide assistance and maintain the service.
			</p>
		</section>

		<!-- How We Use Information -->
		<section class="mb-12">
			<div class="flex items-center mb-6">
				<UserCheck class="h-6 w-6 text-gray-600 mr-3" />
				<h2 class="text-2xl font-bold text-gray-900 m-0">How We Use Your Information</h2>
			</div>
			
			<div class="bg-gray-50 rounded-lg p-6 mb-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-3">Primary Uses</h3>
				<ul class="space-y-2 text-gray-700">
					<li class="flex items-start">
						<span class="text-gray-500 mr-2">•</span>
						Providing and improving our writing platform and AI features
					</li>
					<li class="flex items-start">
						<span class="text-gray-500 mr-2">•</span>
						Authenticating your identity and securing your account
					</li>
					<li class="flex items-start">
						<span class="text-gray-500 mr-2">•</span>
						Syncing your writing across devices
					</li>
					<li class="flex items-start">
						<span class="text-gray-500 mr-2">•</span>
						Enabling social features you choose to use (friends, challenges)
					</li>
					<li class="flex items-start">
						<span class="text-gray-500 mr-2">•</span>
						Providing customer support when requested
					</li>
				</ul>
			</div>

			<h3 class="text-xl font-semibold text-gray-900 mb-3">AI and Machine Learning</h3>
			<p class="text-gray-700 mb-4">
				Our AI suggestion features analyze your writing to provide personalized recommendations. 
				This analysis happens on secure servers and the results are only shown to you. We do not 
				use your creative content to train our AI models for other users.
			</p>
		</section>

		<!-- Information Sharing -->
		<section class="mb-12">
			<div class="flex items-center mb-6">
				<Globe class="h-6 w-6 text-gray-600 mr-3" />
				<h2 class="text-2xl font-bold text-gray-900 m-0">Information Sharing and Disclosure</h2>
			</div>
			
			<div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
				<div class="flex items-start">
					<AlertTriangle class="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
					<div>
						<h3 class="text-lg font-semibold text-red-900 mb-2">What We Never Do</h3>
						<p class="text-red-800">
							We never sell, rent, or trade your personal information or creative content to third parties. 
							Your writing is yours, and it stays private unless you explicitly choose to share it.
						</p>
					</div>
				</div>
			</div>

			<h3 class="text-xl font-semibold text-gray-900 mb-3">When We May Share Information</h3>
			<ul class="space-y-3 text-gray-700 mb-6">
				<li class="flex items-start">
					<span class="text-gray-500 mr-2">•</span>
					<strong>With Your Consent:</strong> When you explicitly choose to share writing progress or content with friends
				</li>
				<li class="flex items-start">
					<span class="text-gray-500 mr-2">•</span>
					<strong>Service Providers:</strong> Trusted third parties that help us operate our platform (hosting, email)
				</li>
				<li class="flex items-start">
					<span class="text-gray-500 mr-2">•</span>
					<strong>Legal Requirements:</strong> When required by law, court order, or to protect our users' safety
				</li>
				<li class="flex items-start">
					<span class="text-gray-500 mr-2">•</span>
					<strong>Business Transfer:</strong> In the unlikely event of a merger or acquisition (with continued privacy protection)
				</li>
			</ul>
		</section>

		<!-- Data Security -->
		<section class="mb-12">
			<div class="flex items-center mb-6">
				<Lock class="h-6 w-6 text-gray-600 mr-3" />
				<h2 class="text-2xl font-bold text-gray-900 m-0">Data Security</h2>
			</div>
			
			<p class="text-gray-700 mb-6">
				We implement industry-standard security measures to protect your information:
			</p>

			<div class="grid md:grid-cols-2 gap-6 mb-6">
				<div class="bg-green-50 rounded-lg p-4">
					<h4 class="font-semibold text-green-900 mb-2">Encryption</h4>
					<p class="text-green-800 text-sm">
						All data is encrypted in transit (TLS 1.3) and at rest (AES-256)
					</p>
				</div>
				<div class="bg-blue-50 rounded-lg p-4">
					<h4 class="font-semibold text-blue-900 mb-2">Access Controls</h4>
					<p class="text-blue-800 text-sm">
						Strict employee access controls and regular security audits
					</p>
				</div>
				<div class="bg-purple-50 rounded-lg p-4">
					<h4 class="font-semibold text-purple-900 mb-2">Infrastructure</h4>
					<p class="text-purple-800 text-sm">
						Hosted on secure, SOC 2 compliant cloud infrastructure
					</p>
				</div>
				<div class="bg-orange-50 rounded-lg p-4">
					<h4 class="font-semibent text-orange-900 mb-2">Monitoring</h4>
					<p class="text-orange-800 text-sm">
						24/7 security monitoring and incident response procedures
					</p>
				</div>
			</div>
		</section>

		<!-- Your Rights -->
		<section class="mb-12">
			<div class="flex items-center mb-6">
				<UserCheck class="h-6 w-6 text-gray-600 mr-3" />
				<h2 class="text-2xl font-bold text-gray-900 m-0">Your Privacy Rights</h2>
			</div>
			
			<div class="bg-blue-50 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-blue-900 mb-4">You Have the Right To:</h3>
				<div class="grid md:grid-cols-2 gap-4 text-blue-800">
					<ul class="space-y-2">
						<li class="flex items-start">
							<span class="text-blue-600 mr-2">✓</span>
							Access all your personal data
						</li>
						<li class="flex items-start">
							<span class="text-blue-600 mr-2">✓</span>
							Correct inaccurate information
						</li>
						<li class="flex items-start">
							<span class="text-blue-600 mr-2">✓</span>
							Export your data in standard formats
						</li>
					</ul>
					<ul class="space-y-2">
						<li class="flex items-start">
							<span class="text-blue-600 mr-2">✓</span>
							Delete your account and data
						</li>
						<li class="flex items-start">
							<span class="text-blue-600 mr-2">✓</span>
							Control information sharing
						</li>
						<li class="flex items-start">
							<span class="text-blue-600 mr-2">✓</span>
							Opt out of non-essential emails
						</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- Cookies and Tracking -->
		<section class="mb-12">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Cookies and Tracking</h2>
			
			<p class="text-gray-700 mb-4">
				We use minimal cookies and tracking technologies, only for essential functionality:
			</p>

			<div class="space-y-4">
				<div class="border border-gray-200 rounded-lg p-4">
					<h4 class="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
					<p class="text-gray-700 text-sm">
						Required for authentication, security, and basic platform functionality. These cannot be disabled.
					</p>
				</div>
				<div class="border border-gray-200 rounded-lg p-4">
					<h4 class="font-semibold text-gray-900 mb-2">Analytics (Optional)</h4>
					<p class="text-gray-700 text-sm">
						Anonymous usage statistics to improve our platform. You can opt out in your account settings.
					</p>
				</div>
			</div>
		</section>

		<!-- Data Retention -->
		<section class="mb-12">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Data Retention</h2>
			
			<p class="text-gray-700 mb-4">
				We retain your information only as long as necessary to provide our services:
			</p>

			<ul class="space-y-2 text-gray-700">
				<li class="flex items-start">
					<span class="text-gray-500 mr-2">•</span>
					<strong>Active Accounts:</strong> Data is retained while your account is active
				</li>
				<li class="flex items-start">
					<span class="text-gray-500 mr-2">•</span>
					<strong>Inactive Accounts:</strong> Data may be deleted after 2 years of inactivity (with notice)
				</li>
				<li class="flex items-start">
					<span class="text-gray-500 mr-2">•</span>
					<strong>Deleted Accounts:</strong> Data is permanently deleted within 30 days of account deletion
				</li>
				<li class="flex items-start">
					<span class="text-gray-500 mr-2">•</span>
					<strong>Backups:</strong> May exist in encrypted backups for up to 90 days after deletion
				</li>
			</ul>
		</section>

		<!-- International Users -->
		<section class="mb-12">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">International Users</h2>
			
			<p class="text-gray-700 mb-4">
				WriterBuddy is operated from the United States. If you're located outside the US, 
				your information will be transferred to and processed in the United States. We ensure 
				appropriate safeguards are in place to protect your data in accordance with this privacy policy.
			</p>
		</section>

		<!-- Children's Privacy -->
		<section class="mb-12">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
			
			<p class="text-gray-700 mb-4">
				WriterBuddy is not intended for children under 13. We do not knowingly collect personal 
				information from children under 13. If we become aware that a child under 13 has provided 
				us with personal information, we will delete such information immediately.
			</p>
		</section>

		<!-- Changes to Privacy Policy -->
		<section class="mb-12">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Changes to This Policy</h2>
			
			<p class="text-gray-700 mb-4">
				We may update this privacy policy from time to time. We will notify you of any material 
				changes by email and by posting a notice on our platform. Your continued use of WriterBuddy 
				after such notification constitutes acceptance of the updated policy.
			</p>
		</section>

		<!-- Contact Information -->
		<section class="mb-12">
			<div class="flex items-center mb-6">
				<Mail class="h-6 w-6 text-gray-600 mr-3" />
				<h2 class="text-2xl font-bold text-gray-900 m-0">Contact Us</h2>
			</div>
			
			<div class="bg-gray-50 rounded-lg p-6">
				<p class="text-gray-700 mb-4">
					If you have any questions about this privacy policy or our privacy practices, please contact us:
				</p>
				
				<div class="space-y-2 text-gray-700">
					<p><strong>Email:</strong> privacy@writerbuddy.com</p>
					<p><strong>Address:</strong> WriterBuddy Privacy Team<br>
					123 Writer's Lane<br>
					Creative City, CC 12345<br>
					United States</p>
				</div>
				
				<p class="text-sm text-gray-600 mt-4">
					We aim to respond to all privacy-related inquiries within 30 days.
				</p>
			</div>
		</section>
	</div>
</div>
