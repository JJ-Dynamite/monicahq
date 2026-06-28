'use client'
import { useState, useEffect } from 'react'
export default function Home() {
  const [contacts, setContacts] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [interactions, setInteractions] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' })
  useEffect(() => { fetchContacts() }, [])
  const fetchContacts = async () => {
    const res = await fetch('/api/contacts')
    const data = await res.json()
    setContacts(data.contacts || [])
  }
  const fetchInteractions = async (id: string) => {
    const res = await fetch(`/api/interactions?contactId=${id}`)
    const data = await res.json()
    setInteractions(data.interactions || [])
  }
  const addContact = async () => {
    await fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm({ name: '', email: '', phone: '', company: '' })
    setShowForm(false)
    fetchContacts()
  }
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto flex gap-6 h-[calc(100vh-4rem)]">
        <div className="w-80 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">MonicaHQ</h1>
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-700">+</button>
          </div>
          {showForm && (
            <div className="bg-white/10 rounded-xl p-4 mb-4 space-y-2">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none" />
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none" />
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none" />
              <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company" className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none" />
              <button onClick={addContact} className="w-full bg-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Add Contact</button>
            </div>
          )}
          <div className="space-y-2 overflow-y-auto">
            {contacts.map(c => (
              <div key={c.id} onClick={() => { setSelected(c); fetchInteractions(c.id) }}
                className={`p-3 rounded-xl cursor-pointer transition ${selected?.id === c.id ? 'bg-blue-600/30 ring-1 ring-blue-500' : 'bg-white/5 hover:bg-white/10'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">{c.name[0]}</div>
                  <div><p className="font-medium text-sm">{c.name}</p><p className="text-gray-400 text-xs">{c.company}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-white/5 rounded-2xl p-6 overflow-y-auto">
          {selected ? (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold">{selected.name[0]}</div>
                <div>
                  <h2 className="text-2xl font-bold">{selected.name}</h2>
                  <p className="text-gray-400">{selected.email} | {selected.phone}</p>
                  <p className="text-gray-500 text-sm">{selected.company}</p>
                </div>
              </div>
              <h3 className="font-semibold mb-3 text-gray-300">Interactions</h3>
              <div className="space-y-3">
                {interactions.map(i => (
                  <div key={i.id} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full">{i.kind}</span>
                      <span className="text-gray-500 text-xs">{new Date(i.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{i.notes}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center"><p className="text-4xl mb-2">👤</p><p>Select a contact to view details</p></div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
