import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Globe,
  Mail,
  Phone,
  Share2,
  MessageSquare,
  Heart
} from 'lucide-react';

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Plumbing Experts', href: '/plumbing-experts' },
    { name: 'Electrical Experts', href: '/electrical-experts' },
    { name: 'AC Technicians', href: '/technician-experts' },
    { name: 'Cleaning Services', href: '/cleaning-experts' },
    { name: 'Carpentry Repair', href: '/carpentry-experts' },
    { name: 'Home Painting', href: '/painting-experts' },
  ];

  const company = [
    { name: 'About Us', href: '#home' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Community Service', href: '/community' },
    { name: 'Become an Expert', href: '/become-expert' },
    { name: 'Contact Us', href: '#faq' },
  ];

  const legal = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Security Policy', href: '#' },
    { name: 'Service Warranty', href: '#' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Company Intro Branding */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Expert<span className="text-blue-500">Service</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Next-generation AI-powered home service marketplace. Connecting homeowners with background-verified professionals instantly with real-time GPS tracking and transparent pricing.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Globe, href: '#', label: 'Website' },
                { icon: Mail, href: '#', label: 'Email' },
                { icon: Phone, href: '#', label: 'Phone' },
                { icon: Share2, href: '#', label: 'Share' },
                { icon: MessageSquare, href: '#', label: 'Chat' }
              ].map((social, i) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {services.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {company.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal & Safety
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {legal.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} ExpertService Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for verified home services</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterSection;
