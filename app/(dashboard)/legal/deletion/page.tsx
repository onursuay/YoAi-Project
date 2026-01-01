export default function DataDeletionPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-2xl font-bold">Data Deletion Request</h1>
      
      <div className="bg-[#111] p-8 rounded-2xl border border-[#1a1a1a] space-y-6">
        <section>
          <h2 className="text-lg font-bold mb-3">How to Request Data Deletion</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            You can request deletion of your account data and all associated marketing data at any time. 
            Once deleted, this action cannot be undone.
          </p>
          
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mb-6">
            <p className="text-sm text-red-400 font-semibold mb-2">⚠️ Warning: Permanent Action</p>
            <p className="text-xs text-red-400/80">
              Deleting your account will permanently remove all your data, connected accounts, 
              campaigns, reports, and AI insights. This action cannot be reversed.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-[#0d0d0d] rounded-lg border border-[#1a1a1a]">
              <h3 className="font-semibold mb-2">Option 1: Delete via Dashboard</h3>
              <p className="text-xs text-gray-500">
                Go to Settings → Account → Delete Account. You will be asked to confirm your password.
              </p>
            </div>

            <div className="p-4 bg-[#0d0d0d] rounded-lg border border-[#1a1a1a]">
              <h3 className="font-semibold mb-2">Option 2: Email Request</h3>
              <p className="text-xs text-gray-500">
                Send an email to deletion@yoai.com with your account email and request. 
                We will process your request within 30 days.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">What Gets Deleted</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
            <li>Account credentials and profile information</li>
            <li>All connected Meta and Google Ads account data</li>
            <li>Campaign data, reports, and analytics</li>
            <li>AI-generated insights and recommendations</li>
            <li>SEO tracking data and keyword rankings</li>
            <li>All historical performance data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">Data Retention Period</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            After deletion request, data is retained for 30 days in case you change your mind. 
            After 30 days, all data is permanently deleted from our systems and backups.
          </p>
        </section>
      </div>
    </div>
  );
}

