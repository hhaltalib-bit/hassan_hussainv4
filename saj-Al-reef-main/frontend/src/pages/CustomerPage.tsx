import { useState } from 'react'
import CustomerView from '../views/CustomerView'
import { supabase } from '../lib/supabase'

export default function CustomerPage() {
  const params = new URLSearchParams(window.location.search)
  const [tableNum,  setTableNum]  = useState(parseInt(params.get('table') || '1'))
  // TESTING ONLY - REMOVE BEFORE PRODUCTION
  const [showPicker, setShowPicker] = useState(false)
  const [resetting,  setResetting]  = useState(false)  // TESTING ONLY

  // TESTING ONLY - REMOVE BEFORE PRODUCTION
  function selectTable(n: number) {
    setTableNum(n)
    setShowPicker(false)
    window.history.replaceState({}, '', `?table=${n}`)
  }

  // TESTING ONLY - REMOVE BEFORE PRODUCTION
  async function resetTestTables() {
    setResetting(true)

    // Step 1: Close all open sessions for tables 1-4
    await supabase
      .from('sessions')
      .update({ closed_at: new Date().toISOString(), paid: true })
      .in('table_id', [1, 2, 3, 4])
      .is('closed_at', null)

    // Step 2: Force reset ALL 4 tables status and session
    await supabase
      .from('restaurant_tables')
      .update({ status: 'g', current_session_id: null })
      .in('n', [1, 2, 3, 4])

    // Step 3: Wait 500ms then hard reload to table 1
    await new Promise(r => setTimeout(r, 500))
    window.location.href = '/?table=1'
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center overflow-hidden relative"
      style={{ background: '#080808' }}
      dir="rtl"
    >
      {/* Atmospheric background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(220,169,92,0.09) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px]"
          style={{ background: 'radial-gradient(ellipse, rgba(220,169,92,0.04) 0%, transparent 70%)' }}
        />
        {/* Noise grain */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Top status bar */}
      <div className="w-full flex justify-between items-center px-5 pt-4 pb-1 relative z-10 max-w-[400px]">
        <div className="flex items-center gap-1.5">
          <div className="relative w-1.5 h-1.5">
            <div className="absolute w-1.5 h-1.5 rounded-full bg-ok" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-ok animate-ping" style={{ animationDuration: '1.8s' }} />
          </div>
          <span className="text-[9px] text-white/25 tracking-[2px] font-sans uppercase">Live • Table {tableNum}</span>
        </div>
        <div className="text-[9px] text-white/20 tracking-[3px] font-sans">SAJ AL-REEF</div>
      </div>

      {/* Phone — key forces remount (and fresh session) when table changes */}
      <div className="relative z-10 w-full flex justify-center flex-1">
        <CustomerView key={tableNum} tableNum={tableNum} />
      </div>

      {/* Bottom signature */}
      <div className="relative z-10 pb-4 text-center">
        <div className="text-[9px] text-white/10 tracking-[3px] font-sans">SCAN TO ORDER</div>
      </div>

      {/* ── TESTING ONLY - REMOVE BEFORE PRODUCTION ─────────────── */}
      <div className="fixed top-3 left-3 z-50" dir="ltr">
        <div className="flex gap-1.5">
          <button
            onClick={() => setShowPicker(v => !v)}
            className="text-[11px] font-mono text-white/60 bg-black/80 border border-white/10 rounded-[7px] px-3 py-1.5 hover:border-gold/40 hover:text-gold transition-colors cursor-pointer backdrop-blur-sm"
          >
            T{tableNum} ▾
          </button>
          {/* TESTING ONLY - REMOVE BEFORE PRODUCTION */}
          <button
            onClick={resetTestTables}
            disabled={resetting}
            className="text-[11px] font-mono rounded-[7px] px-2.5 py-1.5 cursor-pointer transition-colors backdrop-blur-sm disabled:opacity-50"
            style={{ background: 'rgba(226,75,74,0.15)', border: '1px solid rgba(226,75,74,0.3)', color: '#E24B4A' }}
            title="Reset tables 1-4 (TESTING ONLY)"
          >
            {resetting ? '...' : '🔄'}
          </button>
        </div>
        {showPicker && (
          <div className="absolute top-full left-0 mt-1 rounded-[9px] border border-white/10 overflow-hidden shadow-2xl" style={{ background: '#111111', minWidth: 100 }}>
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => selectTable(n)}
                className="w-full px-4 py-2 text-[12px] text-right cursor-pointer hover:bg-white/5 transition-colors border-none"
                style={{ color: tableNum === n ? '#DCA95C' : 'rgba(255,255,255,0.6)', background: 'transparent' }}
              >
                طاولة {n}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* ── END TESTING ONLY ─────────────────────────────────────── */}
    </div>
  )
}
