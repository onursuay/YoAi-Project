export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
          <h2 className="text-lg font-bold mb-4">Account Preferences</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive weekly performance reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#1a1a1a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0070f3]"></div>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">AI Recommendations</p>
                <p className="text-xs text-gray-500">Show AI-powered optimization tips</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[#1a1a1a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0070f3]"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
          <h2 className="text-lg font-bold mb-4">Currency & Locale</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Currency</label>
              <select className="w-full mt-2 px-4 py-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg text-sm">
                <option value="TRY">Turkish Lira (₺)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Time Zone</label>
              <select className="w-full mt-2 px-4 py-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg text-sm">
                <option value="Europe/Istanbul">Istanbul (GMT+3)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">New York (EST)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
          <h2 className="text-lg font-bold mb-4">Account Management</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-sm font-medium hover:bg-[#222] transition-all">
              Change Password
            </button>
            <button className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-sm font-medium hover:bg-[#222] transition-all">
              Export Data
            </button>
            <button className="w-full px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/20 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

