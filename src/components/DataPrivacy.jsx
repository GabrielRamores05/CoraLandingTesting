import { useEffect } from "react";
import "./DataPrivacy.css";

function DataPrivacy({ onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="dp-page">
      <header className="dp-header">
        <div className="dp-header-inner">
          <button className="dp-back-btn" onClick={onBack} aria-label="Go back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            <span>Back</span>
          </button>
          <img src="/assets/logos/cora.png" alt="CORA Logo" className="dp-logo" />
          <div className="dp-header-spacer" />
        </div>
      </header>

      <main className="dp-main">
        <div className="dp-hero">
          <div className="dp-hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Data Privacy Policy
          </div>
          <h1 className="dp-title">Privacy Policy</h1>
          <p className="dp-updated">Effective Date: June 18, 2026 &nbsp;|&nbsp; Last Updated: June 18, 2026</p>
          <p className="dp-subtitle">
            This Privacy Policy governs the manner in which <strong>Edgepoint Solutions, Inc.</strong> ("Edgepoint", "we", "us", or "our"), developer and provider of the <strong>Cooperative Operations and Records Application (CORA)</strong>, collects, uses, maintains, and discloses information from users of our software and website in compliance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> and its Implementing Rules and Regulations (IRR).
          </p>
        </div>

        <div className="dp-body">

          {/* 1 */}
          <section className="dp-section">
            <h2 className="dp-section-title">1. Scope and Application</h2>
            <p>This policy applies to all personal data collected by CORA through:</p>
            <ul>
              <li>The CORA cooperative management software (Online and Offline editions)</li>
              <li>Our official website (<strong>cora-ph.com</strong>)</li>
              <li>Inquiry forms, demo booking requests, and communications made through our channels</li>
              <li>Data imported by cooperatives into the CORA system on behalf of their members</li>
            </ul>
            <p>By using CORA, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of our products and services.</p>
          </section>

          {/* 2 */}
          <section className="dp-section">
            <h2 className="dp-section-title">2. Identity of the Personal Information Controller</h2>
            <div className="dp-info-box">
              <p><strong>Company Name:</strong> Edgepoint Solutions, Inc.</p>
              <p><strong>Product:</strong> CORA (Cooperative Operations and Records Application)</p>
              <p><strong>Address:</strong> 4th Level, Nagaland Emall Building, Elias Angeles St., Naga City, Philippines, 4400</p>
              <p><strong>Email:</strong> edgepoint.solutions.inc@gmail.com</p>
              <p><strong>Phone:</strong> 0962 807 3120</p>
              <p><strong>Data Protection Officer (DPO):</strong> To be designated per NPC Advisory No. 2017-01. Inquiries may be directed to the email above.</p>
            </div>
          </section>

          {/* 3 */}
          <section className="dp-section">
            <h2 className="dp-section-title">3. Personal Data We Collect</h2>
            <p>We collect the following categories of personal data, depending on how you interact with CORA:</p>
            <h3 className="dp-sub-heading">A. From Cooperative Clients (Organizations)</h3>
            <ul>
              <li>Business or cooperative name, CDA registration number</li>
              <li>Authorized representative name, position, and contact details</li>
              <li>Billing and payment information</li>
              <li>System usage logs and activity records</li>
            </ul>
            <h3 className="dp-sub-heading">B. From Cooperative Members (Processed on behalf of clients)</h3>
            <ul>
              <li>Full name, date of birth, civil status, and nationality</li>
              <li>Government-issued ID numbers (TIN, SSS, PhilHealth, Pag-IBIG)</li>
              <li>Contact information (address, phone number, email)</li>
              <li>Employment details, employer name, and employee ID</li>
              <li>Savings account balances, loan records, and share capital</li>
              <li>Beneficiary information</li>
            </ul>
            <h3 className="dp-sub-heading">C. From Website Visitors and Inquirers</h3>
            <ul>
              <li>Name, email address, phone number, and cooperative name submitted via forms</li>
              <li>IP address, browser type, device type, and referral source (collected automatically)</li>
            </ul>
            <div className="dp-note-inline">
              <strong>Note on Member Data:</strong> Cooperative member records are entered into CORA by the subscribing cooperative, which acts as the Personal Information Controller for its members&apos; data. Edgepoint acts as the Personal Information Processor for such data, processing it solely on the cooperative&apos;s instructions.
            </div>
          </section>

          {/* 4 */}
          <section className="dp-section">
            <h2 className="dp-section-title">4. Purpose and Legal Basis of Processing</h2>
            <p>We process personal data for the following purposes under Section 12 and 13 of RA 10173:</p>
            <table className="dp-table">
              <thead>
                <tr><th>Purpose</th><th>Legal Basis</th></tr>
              </thead>
              <tbody>
                <tr><td>Providing and operating the CORA software platform</td><td>Contractual necessity</td></tr>
                <tr><td>Onboarding, data migration, and system setup assistance</td><td>Contractual necessity</td></tr>
                <tr><td>Billing, subscription management, and payment processing</td><td>Contractual necessity / Legal obligation</td></tr>
                <tr><td>Generating CDA reports and regulatory submissions</td><td>Legal obligation (CDA Act, RA 9520)</td></tr>
                <tr><td>Responding to demo requests and inquiries</td><td>Legitimate interest / Consent</td></tr>
                <tr><td>Product improvement, analytics, and system diagnostics</td><td>Legitimate interest</td></tr>
                <tr><td>Security monitoring and fraud prevention</td><td>Legitimate interest / Legal obligation</td></tr>
              </tbody>
            </table>
          </section>

          {/* 5 */}
          <section className="dp-section">
            <h2 className="dp-section-title">5. Data Retention</h2>
            <p>We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, or as required by applicable law:</p>
            <ul>
              <li><strong>Client account data:</strong> Retained for the duration of the subscription plus 5 years after termination, in accordance with accounting and tax regulations.</li>
              <li><strong>Member records (processed on behalf of cooperatives):</strong> Retained per the cooperative's own retention policies; Edgepoint does not independently retain this data beyond the contractual period.</li>
              <li><strong>Inquiry and website forms:</strong> Retained for up to 2 years from the date of submission.</li>
              <li><strong>System logs:</strong> Retained for 12 months for security and diagnostic purposes.</li>
            </ul>
            <p>Upon expiration of the applicable retention period, data will be securely deleted or anonymized.</p>
          </section>

          {/* 6 */}
          <section className="dp-section">
            <h2 className="dp-section-title">6. Data Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent personal data to third parties. We may share data only under the following circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who assist in hosting, email delivery, payment processing, or customer support, bound by strict confidentiality and data processing agreements.</li>
              <li><strong>Regulatory Compliance:</strong> When required by Philippine law, a valid court order, or government agency (e.g., National Privacy Commission, Bureau of Internal Revenue, Cooperative Development Authority).</li>
              <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or asset sale, personal data may be transferred with appropriate safeguards and notice to affected parties.</li>
            </ul>
            <p>All third-party processors are required to implement adequate data protection measures consistent with RA 10173.</p>
          </section>

          {/* 7 */}
          <section className="dp-section">
            <h2 className="dp-section-title">7. Data Security Measures</h2>
            <p>We implement physical, technical, and organizational security measures to protect personal data from unauthorized access, disclosure, alteration, or destruction, including but not limited to:</p>
            <ul>
              <li>Role-based access controls limiting data access to authorized personnel only</li>
              <li>Encrypted transmission of data over secure connections (HTTPS/TLS)</li>
              <li>Regular system security audits and vulnerability assessments</li>
              <li>For the offline edition: data remains entirely on the cooperative's own local infrastructure</li>
              <li>Employee data privacy training and confidentiality agreements</li>
            </ul>
            <p>In the event of a personal data breach, we will notify affected parties and the National Privacy Commission (NPC) within 72 hours of becoming aware, as required under NPC Circular No. 16-03.</p>
          </section>

          {/* 8 */}
          <section className="dp-section">
            <h2 className="dp-section-title">8. Rights of Data Subjects</h2>
            <p>Under the Data Privacy Act of 2012 (Section 16, RA 10173), you have the following rights with respect to your personal data:</p>
            <div className="dp-rights-grid">
              {[
                { right: "Right to be Informed", desc: "You have the right to know how your personal data is being collected, processed, and used." },
                { right: "Right to Access", desc: "You may request a copy of the personal data we hold about you, free of charge, within a reasonable period." },
                { right: "Right to Rectification", desc: "You may request correction of any inaccurate or incomplete personal data we hold." },
                { right: "Right to Erasure", desc: "You may request deletion of your personal data when it is no longer necessary for the purposes it was collected, subject to legal obligations." },
                { right: "Right to Object", desc: "You may object to processing of your data for direct marketing, profiling, or research purposes at any time." },
                { right: "Right to Data Portability", desc: "You may request your data in a structured, commonly used, machine-readable format." },
                { right: "Right to Lodge a Complaint", desc: "You may file a complaint with the National Privacy Commission (NPC) at www.privacy.gov.ph if you believe your rights have been violated." },
              ].map((item) => (
                <div className="dp-right-item" key={item.right}>
                  <div className="dp-right-label">{item.right}</div>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
            <p>To exercise any of these rights, contact our Data Protection Officer at <strong>edgepoint.solutions.inc@gmail.com</strong>. We will respond within 15 business days.</p>
          </section>

          {/* 9 */}
          <section className="dp-section">
            <h2 className="dp-section-title">9. Cookies and Website Analytics</h2>
            <p>Our website may use cookies and similar tracking technologies to enhance user experience. These may include:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (e.g., page visits, referral sources) — data is aggregated and anonymized</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences across visits</li>
            </ul>
            <p>You may disable cookies through your browser settings. Note that disabling certain cookies may affect the functionality of the website.</p>
          </section>

          {/* 10 */}
          <section className="dp-section">
            <h2 className="dp-section-title">10. Children's Privacy</h2>
            <p>CORA is a business-to-business cooperative management platform. We do not knowingly collect personal data from individuals under the age of 18. If you become aware that a minor has submitted personal data to us without parental consent, please contact us immediately so we can promptly remove it.</p>
          </section>

          {/* 11 */}
          <section className="dp-section">
            <h2 className="dp-section-title">11. Cross-Border Data Transfers</h2>
            <p>CORA is a Philippines-based product primarily designed for Philippine cooperatives. If personal data is transferred to servers or service providers outside the Philippines, we ensure that such transfers are made with appropriate safeguards in compliance with NPC guidelines, including contractual clauses that guarantee an adequate level of data protection equivalent to RA 10173.</p>
          </section>

          {/* 12 */}
          <section className="dp-section">
            <h2 className="dp-section-title">12. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. The revised policy will be posted on this page with an updated effective date.</p>
            <p>We encourage you to review this policy periodically. Continued use of CORA after changes have been posted constitutes your acceptance of the updated policy. For material changes, we will notify active clients by email or through an in-system notice.</p>
          </section>

          {/* 13 */}
          <section className="dp-section">
            <h2 className="dp-section-title">13. Contact and Data Protection Officer</h2>
            <div className="dp-info-box">
              <p>For any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please contact us:</p>
              <p><strong>Data Protection Officer</strong><br />Edgepoint Solutions, Inc.</p>
              <p><strong>Email:</strong> edgepoint.solutions.inc@gmail.com</p>
              <p><strong>Phone:</strong> 0962 807 3120</p>
              <p><strong>Address:</strong> 4th Level, Nagaland Emall Building, Elias Angeles St., Naga City, Philippines, 4400</p>
              <p style={{ marginTop: "16px", color: "#6e6e73", fontSize: "14px" }}>You also have the right to lodge a complaint directly with the <strong>National Privacy Commission (NPC)</strong> at <strong>www.privacy.gov.ph</strong>.</p>
            </div>
          </section>

        </div>
      </main>

      <footer className="dp-footer">
        <p>© {new Date().getFullYear()} CORA by Edgepoint Solutions, Inc. All rights reserved. &nbsp;|&nbsp; Compliant with RA 10173 (Data Privacy Act of 2012)</p>
        <button className="dp-footer-back" onClick={onBack}>← Return to Home</button>
      </footer>
    </div>
  );
}

export default DataPrivacy;
