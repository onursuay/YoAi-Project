export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      
      <div className="bg-[#111] p-8 rounded-2xl border border-[#1a1a1a] space-y-6">
        <section>
          <h2 className="text-lg font-bold mb-3">1. Information We Collect</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            YOAI collects information that you provide directly to us, including account credentials, 
            marketing data from connected platforms (Meta Ads, Google Ads), and usage analytics to 
            improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">2. How We Use Your Information</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            We use collected information to provide AI-powered marketing insights, optimize campaign 
            performance, generate reports, and improve the overall dashboard experience. Data is 
            processed securely and never sold to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">3. Data Security</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            We implement industry-standard security measures including encryption, secure API 
            connections, and regular security audits to protect your data from unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">4. Your Rights</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            You have the right to access, modify, or delete your personal data at any time through 
            your account settings or by contacting support. You can disconnect integrations and 
            export your data at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">5. Contact Us</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            For privacy-related inquiries, please contact our privacy team at privacy@yoai.com
          </p>
        </section>
      </div>
    </div>
  );
}

