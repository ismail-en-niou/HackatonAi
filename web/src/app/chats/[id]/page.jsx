import React from 'react';
import { ChatContainer } from '../../containers/ChatContainer';
import { getConversationById, listConversations } from '../../lib/controllers/conversationController';
import Navbar from '@/app/containers/Navbar';
import Link from 'next/link';
import NotFoundActions from '../NotFoundActions.client';

export default async function Page({ params }) {
	const { id } = await params;
	let conversation = null;
	try {
		conversation = await getConversationById(id);
	} catch (err) {
		console.error('Failed to get conversation', err);
	}

	// Check if conversation doesn't exist or is deactivated
	if (!conversation || conversation.isActive === false) {
		// Fetch recent conversations to suggest alternatives
		let recentConversations = [];
		try {
			recentConversations = await listConversations(null, 5, 0);
		} catch (e) {
			console.error('Failed to fetch recent conversations', e);
		}

		return (
			<main className="h-screen flex flex-row bg-gray-50 dark:bg-gray-900 transition-colors">
				<Navbar />
				<div className="flex-1 flex items-center justify-center p-8">
					<div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-colors">
						<div className="text-center">
							<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
								<svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Conversation introuvable</h2>
							<p className="text-gray-600 dark:text-gray-400 mb-6">
								La conversation que vous recherchez n&apos;existe pas ou a été supprimée.
							</p>

							{recentConversations && recentConversations.length > 0 && (
								<div className="mt-8 text-left">
									<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Conversations récentes</h3>
									<ul className="space-y-2">
										{recentConversations.slice(0, 3).map((conv) => (
											<li key={conv._id}>
												<Link 
													href={`/chats/${conv._id}`}
													className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
												>
													<div className="flex items-center justify-between">
														<span className="text-sm font-medium text-gray-900 dark:text-white truncate">
															{conv.title || 'Untitled chat'}
														</span>
														<span className="text-xs text-gray-500 dark:text-gray-400">
															{new Date(conv.updatedAt).toLocaleDateString()}
														</span>
													</div>
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}

							<NotFoundActions className="mt-8" />
						</div>
					</div>
				</div>
			</main>
		);
	}

	const initialMessages = (conversation.messages || []).map((m, i) => ({
		id: m._id?.toString?.() || i + 1,
		text: m.content || m.text || '',
		sender: m.role === 'assistant' ? 'bot' : 'user',
		timestamp: m.timestamp ? new Date(m.timestamp).toISOString() : new Date(conversation.updatedAt || conversation.createdAt || Date.now()).toISOString(),
		liked: m.liked ?? null
	}));

	const conversationIdString = conversation._id?.toString?.() ?? (typeof conversation._id === 'string' ? conversation._id : null);

	return (
		<main className="h-full flex flex-row">
            <Navbar />
			<ChatContainer initialMessages={initialMessages} conversationId={conversationIdString} />
		</main>
	);
}

