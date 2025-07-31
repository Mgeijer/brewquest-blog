import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Mail, Eye, Database, Cookie } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Hop Harrison Beer Journey',
  description: 'Learn how we protect your privacy and handle your data on the Hop Harrison beer journey website.',
  robots: 'index, follow',
}

export default function PrivacyPage() {
  const lastUpdated = '2024-01-15'

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-beer-amber to-beer-gold text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 text-beer-cream" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-beer-cream/90">
              We respect your privacy and are committed to protecting your personal data
            </p>
            <p className="text-sm text-beer-cream/80 mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4 flex items-center gap-3">
            <Eye className="w-6 h-6 text-beer-amber" />
            Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Hop Harrison ("we," "our," or "us") operates the Hop Harrison website (the "Service"). 
            This page informs you of our policies regarding the collection, use, and disclosure of 
            personal data when you use our Service and the choices you have associated with that data.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We use your data to provide and improve the Service. By using the Service, you agree 
            to the collection and use of information in accordance with this policy.
          </p>
        </div>

        {/* Information Collection */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4 flex items-center gap-3">
            <Database className="w-6 h-6 text-beer-amber" />
            Information We Collect
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-beer-dark mb-2">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may collect the following types of personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Email address (when you subscribe to our newsletter)</li>
                <li>Name (if provided when contacting us)</li>
                <li>Feedback and suggestions you provide</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-beer-dark mb-2">Usage Data</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We automatically collect certain information when you visit our website:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>IP address and browser information</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website information</li>
                <li>Device and operating system information</li>
                <li>Interactive map usage and state selections</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-beer-dark mb-2">Cookies and Tracking</h3>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our Service 
                and hold certain information to improve user experience and analyze site usage.
              </p>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4 flex items-center gap-3">
            <Cookie className="w-6 h-6 text-beer-amber" />
            How We Use Your Information
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            We use the collected data for various purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>To provide and maintain our Service</li>
            <li>To send you newsletter updates (with your consent)</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To analyze website usage and improve our content</li>
            <li>To detect and prevent technical issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </div>

        {/* Data Sharing */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Data Sharing and Disclosure</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            except in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>With your explicit consent</li>
            <li>To comply with legal requirements or court orders</li>
            <li>To protect our rights, property, or safety</li>
            <li>With service providers who assist in operating our website (under strict confidentiality agreements)</li>
          </ul>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Data Security</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            We implement appropriate technical and organizational security measures to protect 
            your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <p className="text-gray-700 leading-relaxed">
            However, please note that no method of transmission over the Internet or electronic 
            storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Your Privacy Rights</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            You have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate personal data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from our newsletter at any time</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
          </ul>
          
          <div className="mt-6 p-4 bg-beer-cream/30 rounded-lg">
            <p className="text-gray-700">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:privacy@hopharrison.com" className="text-beer-amber hover:text-beer-gold transition-colors">
                privacy@hopharrison.com
              </a>
            </p>
          </div>
        </div>

        {/* Third-Party Services */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Third-Party Services</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Our website may use third-party services for analytics and functionality:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Google Analytics:</strong> For website analytics and usage tracking</li>
            <li><strong>Social Media Platforms:</strong> For sharing and social features</li>
            <li><strong>Email Service Providers:</strong> For newsletter delivery</li>
          </ul>
          
          <p className="text-gray-700 leading-relaxed mt-4">
            These services have their own privacy policies, and we encourage you to review them.
          </p>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Children's Privacy</h2>
          
          <p className="text-gray-700 leading-relaxed">
            Our Service is intended for users who are at least 21 years old (legal drinking age in the United States). 
            We do not knowingly collect personal information from anyone under the age of 21. If you become aware 
            that a child under 21 has provided us with personal information, please contact us immediately.
          </p>
        </div>

        {/* Changes to Policy */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Changes to This Privacy Policy</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "last updated" date.
          </p>
          <p className="text-gray-700 leading-relaxed">
            You are advised to review this Privacy Policy periodically for any changes. 
            Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-beer-amber/10 to-beer-gold/10 rounded-xl p-8 border border-beer-amber/20">
          <h2 className="text-2xl font-bold text-beer-dark mb-4 flex items-center gap-3">
            <Mail className="w-6 h-6 text-beer-amber" />
            Contact Us
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> <a href="mailto:privacy@hopharrison.com" className="text-beer-amber hover:text-beer-gold transition-colors">privacy@hopharrison.com</a></p>
            <p><strong>Website:</strong> <Link href="/contact" className="text-beer-amber hover:text-beer-gold transition-colors">Contact Form</Link></p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-beer-amber/20">
            <p className="text-sm text-gray-600">
              This privacy policy was last updated on {lastUpdated}. We are committed to protecting 
              your privacy and will continue to update this policy as needed to reflect our practices 
              and legal requirements.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="bg-beer-amber hover:bg-beer-gold text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}