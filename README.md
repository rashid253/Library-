# Digital Business Card SaaS PWA

A complete Progressive Web App for creating, sharing, and managing digital business cards. No server required - everything runs client-side with Supabase backend.

## 🌟 Features

- **PWA Ready**: Installable on Android/iOS like a native app
- **Offline Support**: View cards even without internet
- **Unlimited Cards**: Generate as many cards as you need
- **Shareable Links**: Each card has a permanent URL
- **Real-time Updates**: Changes reflect instantly
- **No Login Required**: Public viewing without authentication
- **Admin Management**: Update any card easily

## 🚀 Quick Start

### 1. Clone/Download Files
Download all files from this repository to a directory.

### 2. Set Up Supabase
1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Create a table called `cards` with:
   - `id` (text, primary key)
   - `data` (text, JSON string)
4. Disable Row Level Security (RLS) for public access
5. Get your Supabase URL and anon key

### 3. Update Configuration
In `app.js`, update these lines:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
