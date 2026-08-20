import { resetPassword } from '../login/actions';
import Link from 'next/link';

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="min-h-screen bg-linen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-sage/20">
        <h1 className="text-3xl font-extrabold text-ink text-center mb-4">Reset Password</h1>
        <p className="text-sage text-center mb-8">Enter your email address and we'll send you a link to reset your password.</p>

        {resolvedSearchParams?.error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-semibold text-center">
            {resolvedSearchParams.error}
          </div>
        )}

        {resolvedSearchParams?.message && (
          <div className="bg-teal/10 text-teal p-4 rounded-xl mb-6 text-sm font-semibold text-center">
            {resolvedSearchParams.message}
          </div>
        )}
        
        <form action={resetPassword} className="flex flex-col gap-4">
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

          <button 
            type="submit"
            className="w-full bg-teal text-white font-bold py-3 rounded-xl hover:bg-teal/90 transition-colors mt-4 shadow-md"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-sage hover:text-teal font-semibold text-sm transition-colors">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
