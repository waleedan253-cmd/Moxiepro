function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Moxie<span className="text-primary-600">Pro</span>
            </h3>
            <p className="text-gray-600 text-sm">
              AI-powered Psychology Today profile optimization for therapists.
              Get more clients with data-driven insights.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/audit" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Start Audit
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/case-studies" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="mailto:hello@moxiepro.com" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                  hello@moxiepro.com
                </a>
              </li>
              <li>
                <p className="text-gray-600 text-sm">
                  Response within 24 hours
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} MoxiePro by Clarity Design Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
