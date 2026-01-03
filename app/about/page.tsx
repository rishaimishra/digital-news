export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            Digital News Platform is an extension of an established newspaper
            business into the digital domain. We are committed to providing
            high-quality regional news while maintaining editorial and
            journalistic standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Accuracy and truth in reporting</li>
            <li>Editorial independence</li>
            <li>Ethical journalism practices</li>
            <li>Community engagement</li>
            <li>Transparency and accountability</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Editorial Standards</h2>
          <p>
            We adhere to the Press Council of India norms and follow established
            journalistic ethics. All content undergoes editorial review to ensure
            quality and compliance with our standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Compliance</h2>
          <p>
            Our platform complies with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IT Act, 2000</li>
            <li>IT Rules, 2021 (Digital Media Ethics)</li>
            <li>DPDP Act, 2023</li>
            <li>Press Council of India guidelines</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p>
            For inquiries, feedback, or grievances, please use our grievance
            redressal mechanism available on the platform.
          </p>
        </section>
      </div>
    </div>
  )
}

