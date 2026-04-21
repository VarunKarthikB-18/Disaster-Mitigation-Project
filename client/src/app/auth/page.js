'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dispatch } = useApp();
  
  const role = searchParams.get('role') || 'citizen';
  const isAdmin = role === 'admin';

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate real auth mechanism
    dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: true, role: isAdmin ? 'admin' : 'citizen' } });
    router.push(isAdmin ? '/admin' : '/dashboard');
  };

  return (
    <div className="auth-container">
      <Link href="/" className="auth-back">← Back to Overview</Link>
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-icon">{isAdmin ? '⚙️' : '🏃'}</div>
          <h2>{isAdmin ? 'Authority Access' : 'Citizen Portal Access'}</h2>
          <p>{isAdmin ? 'Secure login for municipal and NDRF commanders.' : 'Access live routing and request emergency resources.'}</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address / ID Number</label>
            <input type="text" className="form-input" placeholder={isAdmin ? "commander.alpha@ndrf.gov.in" : "e.g., citizen@email.com"} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password / Secure Token</label>
            <input type="password" className="form-input" placeholder="••••••••" required />
          </div>

          <button type="submit" className={`btn btn-full ${isAdmin ? 'btn-danger' : 'btn-primary'}`} style={{ padding: '14px', fontSize: '14px', marginTop: '10px' }}>
            {isAdmin ? 'Authenticate Securely' : 'Sign In & Access Map'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>By signing in, I agree to the <a href="#">Terms of Service</a> & <a href="#">Evacuation Compliance</a> agreements.</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent:'center'}}>Loading Authorization Engine...</div>}>
      <AuthForm />
    </Suspense>
  );
}
