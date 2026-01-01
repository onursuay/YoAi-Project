export default function SupportPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-2xl font-bold">Support</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
          <h2 className="text-lg font-bold mb-4">Documentation</h2>
          <p className="text-sm text-gray-400 mb-4">
            Browse our comprehensive guides and tutorials to get the most out of YOAI.
          </p>
          <button className="px-4 py-2 bg-[#0070f3] rounded-lg text-sm font-bold">
            View Docs
          </button>
        </div>

        <div className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
          <h2 className="text-lg font-bold mb-4">Video Tutorials</h2>
          <p className="text-sm text-gray-400 mb-4">
            Watch step-by-step video guides on connecting accounts and using features.
          </p>
          <button className="px-4 py-2 bg-[#0070f3] rounded-lg text-sm font-bold">
            Watch Videos
          </button>
        </div>
      </div>

      <div className="bg-[#111] p-8 rounded-2xl border border-[#1a1a1a]">
        <h2 className="text-lg font-bold mb-4">Contact Support</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Subject</label>
            <input 
              type="text" 
              placeholder="What can we help you with?"
              className="w-full mt-2 px-4 py-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg focus:outline-none focus:border-[#0070f3] transition-colors text-white text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Message</label>
            <textarea 
              placeholder="Describe your issue or question..."
              rows={6}
              className="w-full mt-2 px-4 py-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg focus:outline-none focus:border-[#0070f3] transition-colors text-white text-sm resize-none"
            />
          </div>
          
          <button className="px-6 py-3 bg-[#0070f3] rounded-lg text-sm font-bold hover:bg-[#0070f3]/90 transition-all">
            Send Message
          </button>
        </div>
      </div>

      <div className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
        <h2 className="text-lg font-bold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg text-sm hover:border-[#0070f3]/50 transition-all">
            Account Connection Issues
          </button>
          <button className="p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg text-sm hover:border-[#0070f3]/50 transition-all">
            Billing Questions
          </button>
          <button className="p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg text-sm hover:border-[#0070f3]/50 transition-all">
            Feature Requests
          </button>
        </div>
      </div>
    </div>
  );
}

