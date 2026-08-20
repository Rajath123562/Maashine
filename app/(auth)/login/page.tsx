import { login } from './actions';
import Link from 'next/link';
import GoogleSignInButton from '../../../components/GoogleSignInButton';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="min-h-screen bg-linen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-sage/20">
        <h1 className="text-3xl font-extrabold text-ink text-center mb-6">Welcome Back</h1>
        <p className="text-sage text-center mb-8">Log in to your MaaShine account</p>

        {resolvedSearchParams?.message && (
          <div className="bg-teal/10 border border-teal/30 text-teal p-4 rounded-xl mb-6 text-sm font-semibold text-center">
            {resolvedSearchParams.message}
          </div>
        )}

        {resolvedSearchParams?.error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-semibold text-center">
            {resolvedSearchParams.error}
          </div>
        )}

        {/* 1-Click Google Sign In */}
        <div className="mb-6">
          <GoogleSignInButton label="Continue with Google" />
          
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Or with email
            </span>
          </div>
        </div>

        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-ink">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-ink">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-teal hover:underline font-semibold">Forgot Password?</Link>
          </div>

          <button 
            formAction={login}
            className="w-full bg-teal text-white font-bold py-3 rounded-xl hover:bg-teal/90 transition-colors mt-2"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-sage mt-6">
          Don't have an account? <Link href="/register" className="text-teal font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
