// filepath: d:\project\PgPaal\PgPaalWeb\src\components\Footer.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon, HeartIcon } from "@heroicons/react/24/solid";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    services: [
      { label: "For Tenants", href: "/tenants" },
      { label: "For Owners", href: "/owners" },
      { label: "Property Management", href: "/management" },
      { label: "Rent Collection", href: "/rent-collection" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                Pg<span className="text-purple-400">Paal</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Making PG accommodation simple, safe, and affordable. Connect with
              verified PGs and trusted owners across India.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <PhoneIcon className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <EnvelopeIcon className="w-4 h-4" />
                <span>support@pgpaal.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPinIcon className="w-4 h-4" />
                <span>Hyderabad, India</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-black hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-black hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-black hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 PgPaal. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <HeartIcon className="w-4 h-4 text-red-500" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
