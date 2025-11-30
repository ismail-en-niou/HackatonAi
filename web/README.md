This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Chat History API

The project exposes a small API to store and fetch chat conversations. Endpoints:

- GET /api/chats - returns a list of saved conversations (optional pagination via `?limit=20&skip=0`). If a JWT token is present in `Authorization: Bearer <token>` or in the `cookie` header as `token=...`, the result will be filtered by user.
- POST /api/chats - saves a conversation. Body example:

```json
{
	"messages": [
		{"role": "user", "content": "Hello"},
		{"role": "assistant", "content": "Hi, how can I help?"}
	],
	"title": "Optional custom title",
	"tags": ["example"]
}
```

The server will generate a title automatically if none is provided, using the first user message.

GET /api/chats/:id - returns an individual conversation by ID.

