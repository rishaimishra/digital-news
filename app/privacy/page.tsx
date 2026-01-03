export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and email address when you register</li>
            <li>Content you submit as a reporter or editor</li>
            <li>Information you provide when contacting us or submitting grievances</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and manage your account</li>
            <li>Send you administrative communications</li>
            <li>Respond to your inquiries and grievances</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Data Protection</h2>
          <p>
            We implement appropriate security measures to protect your personal
            information. However, no method of transmission over the internet is
            100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
          <p>Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p>
            For any privacy-related concerns or to exercise your rights, please
            contact us through our grievance redressal mechanism.
          </p>
        </section>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

