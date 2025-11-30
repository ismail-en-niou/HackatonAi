// pages/index.js
'use client';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from './containers/Navbar';
import { ChatContainer } from './containers/ChatContainer';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Head>
        <title>KnowledgeHub | Accès au Savoir Opérationnel</title>
        <meta name="description" content="Chatbot intelligent pour accéder au savoir opérationnel de l'entreprise" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='w-full flex flex-row'>
       <Navbar/>
       <ChatContainer/>
      </div>
    </div>
  );
}