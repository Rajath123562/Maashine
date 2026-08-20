import { signup } from '../login/actions';
import Link from 'next/link';
import GoogleSignInButton from '../../../components/GoogleSignInButton';

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="min-h-screen bg-linen flex items-center justify-center p-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-sage/20">
        <h1 className="text-3xl font-extrabold text-ink text-center mb-2">Create an Account</h1>
        <p className="text-sage text-center mb-8">Join MaaShine for premium cleaning services.</p>

        {resolvedSearchParams?.error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-semibold text-center">
            {resolvedSearchParams.error}
          </div>
        )}

        {/* 1-Click Google Sign Up */}
        <div className="mb-6">
          <GoogleSignInButton label="Sign up with Google" />
          
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Or with email
            </span>
          </div>
        </div>
        
        <form action={signup} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-ink">Full Name</label>
            <input 
              id="full_name" 
              name="full_name" 
              type="text" 
              required 
              className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-ink">Email Address</label>
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
            <label className="block text-sm font-semibold mb-1 text-ink">Phone Number</label>
            <input 
              id="phone" 
              name="phone" 
              type="tel" 
              required 
              className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal"
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-ink">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="w-full border border-sage/40 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal"
              placeholder="••••••••"
            />
          </div>

          <button 
            formAction={signup}
            className="w-full bg-teal text-white font-bold py-3 rounded-xl hover:bg-teal/90 transition-colors mt-4 shadow-md"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-sage mt-6">
          Already have an account? <Link href="/login" className="text-teal font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
