'use client';

import { useEffect, useState, useRef } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { 
  BookOpen, 
  Bookmark, 
  Plus, 
  Trash2, 
  LogOut, 
  Search, 
  ExternalLink,
  Globe,
  Clock,
  Command,
  ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [search, setSearch] = useState('');
  const channelRef = useRef<any>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchBookmarks(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchBookmarks(session.user.id);
      } else {
        setUser(null);
        setBookmarks([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    channelRef.current = supabase
      .channel('bookmarks')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookmarks', 
          filter: `user_id=eq.${user.id}` 
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setBookmarks(prev => prev.filter(b => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user]);

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });
    setBookmarks(data || []);
  };

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newUrl || !newTitle) return;

    await supabase.from('bookmarks').insert({
      user_id: user.id,
      url: newUrl,
      title: newTitle,
    });
    setNewUrl('');
    setNewTitle('');
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id);
  };

  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(search.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(search.toLowerCase())
  );

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

if (!user) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
  

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-4xl p-8 md:p-12 shadow-2xl border border-white/10">
          

          <div className="text-center space-y-3 mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Sign in
            </h1>
            <p className="text-slate-500 text-[15px] leading-relaxed px-2">
              Access your personal library of bookmarks in one secure workspace.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={signIn}
              className="group relative w-full flex items-center justify-center gap-3 bg-white text-slate-700 py-3.5 px-4 rounded-2xl font-semibold border border-slate-200 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2">
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-indigo-100">
  
      <nav className="border-b border-zinc-200 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-xl">Bookmark</span>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Find a bookmark..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
              />
            </div>
          </div>

          <button
            onClick={signOut}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-6 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Quick Add
              </h2>
              <form onSubmit={addBookmark} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 ml-1">Page Title</label>
                  <input
                    type="text"
                    placeholder="E.g. Design Inspiration"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 ml-1">URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-zinc-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-200"
                >
                  Save to Vault
                </button>
              </form>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl">My Collection</h3>
              <span className="text-xs font-bold px-2.5 py-1 bg-zinc-100 text-zinc-500 rounded-full">
                {filteredBookmarks.length} Items
              </span>
            </div>

            {filteredBookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-zinc-300 rounded-3xl">
                <div className="p-4 bg-zinc-50 rounded-full mb-4">
                  <Bookmark className="w-8 h-8 text-zinc-300" />
                </div>
                <p className="text-zinc-500 font-medium">Your vault is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookmarks.map((bookmark: any) => (
                  <div 
                    key={bookmark.id} 
                    className="group bg-white border border-zinc-200 p-5 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                        <Globe className="w-4 h-4 text-zinc-400" />
                      </div>
                      <button
                        onClick={() => deleteBookmark(bookmark.id)}
                        className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <a 
                      href={bookmark.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group/link inline-flex items-center gap-1.5 font-bold text-zinc-800 hover:text-indigo-600 transition-colors mb-1"
                    >
                      <span className="line-clamp-1">{bookmark.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>

                    <p className="text-xs text-zinc-400 truncate mb-4 font-mono">
                      {bookmark.url.replace('https://', '').replace('www.', '')}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-50">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                        <Clock className="w-3 h-3" />
                        {new Date(bookmark.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}