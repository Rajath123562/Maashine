'use client';
import { updateRequestStatus } from '../app/actions/admin';
import { useState } from 'react';

export default function StatusUpdater({ request }: { request: any }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(request.status);
  const [notes, setNotes] = useState(request.admin_notes || '');
  const [msg, setMsg] = useState('');

  async function handleUpdate() {
    setLoading(true);
    setMsg('');
    try {
      await updateRequestStatus(request.id, status, notes);
      setMsg('Updated successfully');
    } catch (err: any) {
      setMsg(err.message || 'Failed to update');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  }

  return (
    <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
      <select 
        value={status} 
        onChange={e => setStatus(e.target.value)}
        className="w-full p-2 rounded border border-slate-300 text-sm font-semibold"
      >
        <option>Pending</option>
        <option>Contacted</option>
        <option>Confirmed</option>
        <option>In Progress</option>
        <option>Completed</option>
        <option>Cancelled</option>
        <option>Rejected</option>
      </select>
      
      <input 
        type="text" 
        placeholder="Admin notes (optional)" 
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="w-full p-2 rounded border border-slate-300 text-xs"
      />
      
      <button 
        onClick={handleUpdate} 
        disabled={loading || (status === request.status && notes === (request.admin_notes || ''))}
        className="w-full bg-ink text-white text-xs font-bold py-2 rounded hover:bg-ink/80 transition-colors disabled:opacity-50"
      >
        {loading ? '...' : 'Save Status'}
      </button>
      {msg && <span className="text-xs text-teal font-bold text-center">{msg}</span>}
    </div>
  );
}
