"use client";
import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Buy for Me", href: "/BuyForMe" },
        { name: "HatHak Store", href: "/HatHakStore" },
        { name: "Logistics", href: "/logistics" },
        { name: "International Shipping", href: "/shipping" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Track Order", href: "/track" },
        { name: "Returns & Refunds", href: "/returns" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Partners", href: "/partners" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Security", href: "/security" },
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];


  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-2 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white transform rotate-45"></div>
              </div>
              <span className="ml-3 text-heading-2 font-semibold">HatHak</span>
            </div>
            <p className="text-body text-neutral-300 mb-6">
              Your trusted partner for e-commerce and logistics solutions. 
              We make global shopping simple, secure, and accessible.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-2" />
                <span className="text-body-small text-neutral-300">support@hathak.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-2" />
                <span className="text-body-small text-neutral-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-2" />
                <span className="text-body-small text-neutral-300">Riyadh, Saudi Arabia</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-1 transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-heading-3 text-white mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-body-small text-neutral-300 hover:text-primary-2 transition-colors flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-body-small text-neutral-400">
              © {currentYear} HatHak Platform. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-body-small text-neutral-400 hover:text-primary-2 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-body-small text-neutral-400 hover:text-primary-2 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-body-small text-neutral-400 hover:text-primary-2 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}