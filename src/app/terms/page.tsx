import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Shield, AlertTriangle, Scale, Gavel } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Hop Harrison Beer Journey',
  description: 'Terms of Service and usage guidelines for the Hop Harrison beer journey website.',
  robots: 'index, follow',
}

export default function TermsPage() {
  const lastUpdated = '2024-01-15'

  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-beer-amber to-beer-gold text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-6 text-beer-cream" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-beer-cream/90">
              Terms and conditions for using the Hop Harrison website
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
            <Scale className="w-6 h-6 text-beer-amber" />
            Agreement to Terms
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms of Service ("Terms") govern your use of the Hop Harrison website 
            operated by Hop Harrison ("us," "we," or "our"). By accessing or using our website, 
            you agree to be bound by these Terms.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you disagree with any part of these terms, then you may not access the Service.
          </p>
        </div>

        {/* Age Requirements */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-beer-amber" />
            Age Restrictions
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This website contains content related to alcoholic beverages. By using this website, 
            you represent and warrant that:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>You are at least 21 years old (the legal drinking age in the United States)</li>
            <li>You are legally permitted to view content about alcoholic beverages in your jurisdiction</li>
            <li>You will not share this content with minors</li>
          </ul>
        </div>

        {/* Acceptable Use */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Acceptable Use</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-beer-dark mb-2">Permitted Uses</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You may use our website for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Reading and enjoying our beer journey content</li>
                <li>Subscribing to our newsletter</li>
                <li>Sharing our content on social media</li>
                <li>Providing feedback and suggestions</li>
                <li>Educational and informational purposes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-beer-dark mb-2">Prohibited Uses</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You may not use our website for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Any unlawful purpose or activity</li>
                <li>Harassment, abuse, or harm to others</li>
                <li>Spam, phishing, or fraudulent activities</li>
                <li>Distributing malware or viruses</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Reproducing our content without permission</li>
                <li>Commercial use without explicit authorization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content and Intellectual Property */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Intellectual Property Rights</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-beer-dark mb-2">Our Content</h3>
              <p className="text-gray-700 leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, 
                is the property of Hop Harrison or its content suppliers and is protected by copyright 
                and other intellectual property laws.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-beer-dark mb-2">User-Generated Content</h3>
              <p className="text-gray-700 leading-relaxed">
                Any content you submit to us (feedback, comments, suggestions) becomes our property 
                and may be used for improving our services. You warrant that such content does not 
                infringe on the rights of third parties.
              </p>
            </div>
          </div>
        </div>

        {/* AI-Generated Content Disclosure */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">AI-Generated Content</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            We are transparent about our use of artificial intelligence in content creation:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Much of our content is researched and written with AI assistance</li>
            <li>All brewery and beer information is researched for accuracy</li>
            <li>Content is reviewed by human oversight for quality and authenticity</li>
            <li>We strive to represent real breweries and their stories accurately</li>
          </ul>
          
          <div className="mt-4 p-4 bg-beer-cream/30 rounded-lg">
            <p className="text-gray-700 text-sm">
              While we use AI tools to enhance our research and storytelling capabilities, 
              we maintain editorial oversight to ensure accuracy and authenticity in all published content.
            </p>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Disclaimers</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-beer-dark mb-2">Content Accuracy</h3>
              <p className="text-gray-700 leading-relaxed">
                While we strive for accuracy, we make no warranties about the completeness, 
                reliability, or accuracy of the information on our website. Brewery information, 
                hours, and availability may change without notice.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-beer-dark mb-2">Responsible Consumption</h3>
              <p className="text-gray-700 leading-relaxed">
                We promote responsible consumption of alcoholic beverages. Please drink responsibly, 
                never drink and drive, and know your limits. If you have a drinking problem, 
                please seek professional help.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-beer-dark mb-2">External Links</h3>
              <p className="text-gray-700 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible 
                for the content, privacy policies, or practices of these external sites.
              </p>
            </div>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4 flex items-center gap-3">
            <Shield className="w-6 h-6 text-beer-amber" />
            Limitation of Liability
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            To the fullest extent permitted by law, Hop Harrison shall not be liable for any 
            indirect, incidental, special, consequential, or punitive damages, or any loss of 
            profits or revenues, whether incurred directly or indirectly.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            Our total liability to you for any claim arising from your use of this website 
            shall not exceed $100.
          </p>
        </div>

        {/* Service Availability */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Service Availability</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            We strive to maintain continuous availability of our website, but we do not guarantee 
            uninterrupted access. We may:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Suspend or modify the service for maintenance</li>
            <li>Update content and features without notice</li>
            <li>Discontinue certain features or sections</li>
            <li>Block access to users who violate these terms</li>
          </ul>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Privacy</h2>
          
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. Please review our{' '}
            <Link href="/privacy" className="text-beer-amber hover:text-beer-gold transition-colors">
              Privacy Policy
            </Link>{' '}
            to understand how we collect, use, and protect your information.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4 flex items-center gap-3">
            <Gavel className="w-6 h-6 text-beer-amber" />
            Governing Law
          </h2>
          
          <p className="text-gray-700 leading-relaxed">
            These Terms shall be interpreted and governed by the laws of the United States 
            and the State of [Your State], without regard to conflict of law provisions. 
            Any disputes shall be resolved in the courts of [Your State].
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Changes to Terms</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            We reserve the right to modify these Terms at any time. We will notify users of 
            significant changes by posting the updated Terms on this page and updating the 
            "last updated" date.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Your continued use of the website after any changes constitutes acceptance of the new Terms.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-beer-amber/10 to-beer-gold/10 rounded-xl p-8 border border-beer-amber/20">
          <h2 className="text-2xl font-bold text-beer-dark mb-4">Contact Us</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> <a href="mailto:legal@hopharrison.com" className="text-beer-amber hover:text-beer-gold transition-colors">legal@hopharrison.com</a></p>
            <p><strong>Website:</strong> <Link href="/contact" className="text-beer-amber hover:text-beer-gold transition-colors">Contact Form</Link></p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-beer-amber/20">
            <p className="text-sm text-gray-600">
              These terms were last updated on {lastUpdated}. By using our website, 
              you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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