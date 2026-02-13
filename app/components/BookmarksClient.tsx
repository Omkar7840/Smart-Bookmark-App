// 'use client';

// import { useEffect, useState } from 'react';
// import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

// type Bookmark = {
//   id: string;
//   url: string;
//   title: string;
//   created_at: string;
// };

// export default function BookmarksClient({ userId }: { userId: string }) {
//   const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
//   const [url, setUrl] = useState('');
//   const [title, setTitle] = useState('');
//   const supabase = createSupabaseBrowserClient();

//   // DEBUG LOGS
//   console.log('=== BOOKMARKS CLIENT DEBUG ===');
//   console.log('userId prop:', userId);
//   console.log('================================');

//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       console.log('🔍 Fetching bookmarks for userId:', userId);
      
//       const { data, error } = await supabase
//         .from('bookmarks')
//         .select('*')
//         .eq('user_id', userId)
//         .order('created_at', { ascending: false });

//       console.log('📊 Query data:', data);
//       console.log('❌ Query error:', error);
      
//       if (!error && data) {
//         setBookmarks(data as Bookmark[]);
//       } else {
//         console.log('💥 No data or error - check RLS policies');
//       }
//     };

//     fetchBookmarks();
//   }, [supabase, userId]);

//   // Rest of your realtime and form code stays the same...
//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!url || !title) return;

//     console.log('➕ Adding bookmark:', { url, title, userId });
    
//     const { data, error } = await supabase.from('bookmarks').insert({
//       url,
//       title,
//       user_id: userId,
//     });

//     console.log('➕ Add result:', data, error);

//     if (!error) {
//       setUrl('');
//       setTitle('');
//     }
//   };

//   const handleDelete = async (id: string) => {
//     console.log('🗑️ Deleting bookmark:', id);
//     await supabase.from('bookmarks').delete().eq('id', id);
//   };

//   return (
//     <div>
//       {/* DEBUG INFO */}
//       <div className="p-4 bg-yellow-100 rounded mb-4">
//         <p>🆔 User ID: <code>{userId}</code></p>
//         <p>📋 Bookmarks count: {bookmarks.length}</p>
//       </div>

//       <section className="space-y-6">
//         <form
//           onSubmit={handleAdd}
//           className="flex flex-col gap-3 p-4 bg-white rounded shadow"
//         >
//           <input
//             type="url"
//             placeholder="https://example.com"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             className="border rounded px-3 py-2 text-sm"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="border rounded px-3 py-2 text-sm"
//             required
//           />
//           <button
//             type="submit"
//             className="self-start px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700"
//           >
//             Add bookmark
//           </button>
//         </form>

//         <ul className="space-y-2">
//           {bookmarks.map((b) => (
//             <li
//               key={b.id}
//               className="flex items-center justify-between px-4 py-2 bg-white rounded shadow"
//             >
//               <div>
//                 <a
//                   href={b.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-blue-600 hover:underline"
//                 >
//                   {b.title}
//                 </a>
//                 <p className="text-xs text-slate-500 break-all">{b.url}</p>
//               </div>
//               <button
//                 onClick={() => handleDelete(b.id)}
//                 className="text-xs text-red-600 hover:underline"
//               >
//                 Delete
//               </button>
//             </li>
//           ))}
//           {bookmarks.length === 0 && (
//             <p className="text-sm text-slate-500">No bookmarks yet.</p>
//           )}
//         </ul>
//       </section>
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useState } from 'react';
// import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

// type Bookmark = {
//   id: string;
//   url: string;
//   title: string;
//   created_at: string;
// };

// export default function BookmarksClient({ userId }: { userId: string }) {
//   const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
//   const [url, setUrl] = useState('');
//   const [title, setTitle] = useState('');
//   const supabase = createSupabaseBrowserClient();

//   // DEBUG LOGS
//   console.log('=== BOOKMARKS CLIENT DEBUG ===');
//   console.log('userId prop:', userId);
//   console.log('================================');

//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       console.log('🔍 Fetching bookmarks for userId:', userId);
      
//       const { data, error } = await supabase
//         .from('bookmarks')
//         .select('*')
//         .eq('user_id', userId)
//         .order('created_at', { ascending: false });

//       console.log('📊 Query data:', data);
//       console.log('❌ Query error:', error);
      
//       if (!error && data) {
//         setBookmarks(data as Bookmark[]);
//       } else {
//         console.log('💥 No data or error - check RLS policies');
//       }
//     };

//     fetchBookmarks();
//   }, [supabase, userId]);

//   // Rest of your realtime and form code stays the same...
//   const handleAdd = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!url || !title) return;

//     console.log('➕ Adding bookmark:', { url, title, userId });
    
//     const { data, error } = await supabase.from('bookmarks').insert({
//       url,
//       title,
//       user_id: userId,
//     });

//     console.log('➕ Add result:', data, error);

//     if (!error) {
//       setUrl('');
//       setTitle('');
//     }
//   };

//   const handleDelete = async (id: string) => {
//     console.log('🗑️ Deleting bookmark:', id);
//     await supabase.from('bookmarks').delete().eq('id', id);
//   };

//   return (
//     <div>
//       {/* DEBUG INFO */}
//       <div className="p-4 bg-yellow-100 rounded mb-4">
//         <p>🆔 User ID: <code>{userId}</code></p>
//         <p>📋 Bookmarks count: {bookmarks.length}</p>
//       </div>

//       <section className="space-y-6">
//         <form
//           onSubmit={handleAdd}
//           className="flex flex-col gap-3 p-4 bg-white rounded shadow"
//         >
//           <input
//             type="url"
//             placeholder="https://example.com"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             className="border rounded px-3 py-2 text-sm"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="border rounded px-3 py-2 text-sm"
//             required
//           />
//           <button
//             type="submit"
//             className="self-start px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700"
//           >
//             Add bookmark
//           </button>
//         </form>

//         <ul className="space-y-2">
//           {bookmarks.map((b) => (
//             <li
//               key={b.id}
//               className="flex items-center justify-between px-4 py-2 bg-white rounded shadow"
//             >
//               <div>
//                 <a
//                   href={b.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-blue-600 hover:underline"
//                 >
//                   {b.title}
//                 </a>
//                 <p className="text-xs text-slate-500 break-all">{b.url}</p>
//               </div>
//               <button
//                 onClick={() => handleDelete(b.id)}
//                 className="text-xs text-red-600 hover:underline"
//               >
//                 Delete
//               </button>
//             </li>
//           ))}
//           {bookmarks.length === 0 && (
//             <p className="text-sm text-slate-500">No bookmarks yet.</p>
//           )}
//         </ul>
//       </section>
//     </div>
//   );
// }
