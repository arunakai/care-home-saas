# Care Home SaaS Platform Deployment Instructions

This document provides instructions for deploying the Care Home SaaS platform to a Canadian hosting provider.

## Prerequisites

- Node.js 18+ and npm
- A hosting provider that supports Next.js applications (Vercel, Netlify, or any Canadian cloud provider)
- A database service (MongoDB, PostgreSQL, or SQLite for development)

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file with the following variables:

```
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
API_URL=your_api_url
```

### 3. Build the Application

```bash
npm run build
```

### 4. Deploy to Hosting Provider

#### Option 1: Vercel (Recommended)

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

#### Option 2: Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy`
3. Follow the prompts to deploy

#### Option 3: Canadian Cloud Provider

1. Upload the `.next` folder to your hosting provider
2. Configure the server to serve the Next.js application

### 5. Database Setup

Run the database migration script:

```bash
node scripts/migrate.js
```

## Free Tier Options

The following Canadian hosting providers offer free tier options:

1. **DigitalOcean** - Offers App Platform with a free tier
2. **OVHcloud** - Canadian data centers with starter plans
3. **Canadian Web Hosting** - Offers shared hosting plans with promotional free periods

## Support

For any deployment issues, please contact support@carehomesaas.com
