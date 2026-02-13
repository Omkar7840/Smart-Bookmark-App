#  Smart Bookmark App

[![Vercel Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository=Omkar7840/Smart-Bookmark-App)

A **modern, realtime bookmark manager** built with **Next.js 14 (App Router)**, **Supabase** , and **Tailwind CSS**.

##  **Live**
[![Live Demo](https://smart-bookmark-app-swart.vercel.app/)](https://smart-bookmark-app-swart.vercel.app/)

##  **Features**
- ✅ **Secured login using Google OAuth** 
- ✅ **Private Bookmarks for every user** 
- ✅ **Realtime Sync**
- ✅ **Search option** 
- ✅ **Production Deployed** 

##  **Tech Stack**
Frontend: Next.js 14 (App Router) + Tailwind CSS
Backend: Supabase (Auth, Postgres, Realtime)
Deployment: Vercel

##  **Screenshots**
<img width="1920" height="1080" alt="Screenshot 2026-02-13 160121" src="https://github.com/user-attachments/assets/f5b0c684-d063-4baa-b2bc-11c2b597f752" />
<img width="1920" height="1080" alt="Screenshot 2026-02-13 160043" src="https://github.com/user-attachments/assets/d3c08795-6e43-4e08-969c-6d38ffba8440" />
<img width="1919" height="968" alt="Screenshot 2026-02-13 155545" src="https://github.com/user-attachments/assets/d8009503-682b-42ad-8f0b-36cbadda1262" />


The Challenge
The major technical problem I faced was getting the bookmarks update immediately after either adding or removig.
The Problem: Whenever I added or removed a bookmark, the changes wouldn't show up on the screen immediately. Oddly, it worked fine on my local machine (localhost), but once deployed to Vercel, the UI would "freeze" after a submission. I literally had to switch browser tabs and come back to make an update and see my new bookmark.
 Analysis: Why was this happening?
In my initial implementation, I was relying entirely on Supabase Realtime to make my UI updates.
When a user submitted a new bookmark, my code was sending the data to the database and then simply waited. I expected the Supabase WebSocket listener (channel.on('postgres_changes')) to hear the database change, send a notification back to my frontend, and update the state.
My Previous Approach (The Flaw):
TypeScript
const addBookmark = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const { data, error } = await supabase.from('bookmarks').insert({ ... }).select().single();
  
  if (data) {
      setBookmarks(prev => [data, ...prev]);
  }
};

While this was working completely fine locally where network latency was basically zero, but on a deployed Vercel app the network latency is real. The time from adding or removing then sending it to the Supabase database was causing a noticeable delay. Also it was only getting updated when I was switching tabs before it even if I waited for minuted it was not getting updated.
 The Solution
To solve this, I completely shifted my state management strategy from a "Server-First" approach to an "Optimistic UI" approach.
Instead of waiting for the database to give me permission to update the screen, I updated the screen instantly assuming the database request would succeed, and handled the server sync in the background.
Here is how I implemented the fix:
1. Instant Local State Updates: I generated a temporary ID using crypto.randomUUID() and immediately injected a "fake" bookmark into the React state. This makes the app feel lightning-fast.
2. Background Sync: While the user sees their bookmark instantly, the app quietly sends the real request to Supabase. Once Supabase responds with the official database row, I swap the temporary ID with the real Database ID.
3. Rollback if any Error come across: If the database request fails for any reason (e.g., loss of internet), the app catches the error, alerts the user, and automatically removes the temporary bookmark from the screen.
4. Duplication of Bookmarks: Because the realtime listener is still active (to sync across multiple devices), I had to add a check to ensure the listener doesn't accidentally add a duplicate bookmark that I had already added optimistically.
The Fixed Implementation:
TypeScript

const addBookmark = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const tempId = crypto.randomUUID(); 
  const optimisticBookmark = { id: tempId, title: newTitle, url: newUrl, /* ... */ };

  setBookmarks(prev => [optimisticBookmark, ...prev]);
  
    const { data, error } = await supabase.from('bookmarks').insert({ ... }).select().single();

  if (error) {
        setBookmarks(prev => prev.filter(b => b.id !== tempId));
  } else {
        setBookmarks(prev => prev.map(b => (b.id === tempId ? data : b)));
  }
};

if (payload.eventType === 'INSERT') {
  setBookmarks(prev => {
    if (prev.some(b => b.id === payload.new.id)) return prev;
    return [payload.new, ...prev];
  });
}

The Result: The app now feels completely instant and snappy on Vercel, regardless of network speed, while still maintaining perfect sync with the backend database.

