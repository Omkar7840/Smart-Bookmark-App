'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function signInWithGoogle() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    throw new Error('Failed to sign in');
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/');
}
