export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this platform, you accept and agree to be
            bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
          <p>Users are responsible for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining the confidentiality of their account credentials</li>
            <li>All activities that occur under their account</li>
            <li>Ensuring content submitted is accurate and complies with applicable laws</li>
            <li>Respecting intellectual property rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Content Guidelines</h2>
          <p>
            Content submitted to the platform must comply with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Indian IT Act, 2000 and IT Rules, 2021</li>
            <li>Press Council of India norms</li>
            <li>Journalistic ethics and standards</li>
            <li>Prohibited content guidelines (hate speech, defamation, etc.)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Editorial Control</h2>
          <p>
            All content is subject to editorial review and approval before
            publication. The platform reserves the right to reject, edit, or
            remove content that does not meet our standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Advertisement and Sponsored Content</h2>
          <p>
            Advertisements and sponsored content are clearly labeled as such.
            The platform is not responsible for the content or claims made in
            advertisements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p>
            The platform shall not be liable for any indirect, incidental,
            special, or consequential damages arising from the use of our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Grievance Redressal</h2>
          <p>
            Users may submit grievances through our grievance redressal mechanism.
            We are committed to addressing complaints in accordance with applicable
            regulations.
          </p>
        </section>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

