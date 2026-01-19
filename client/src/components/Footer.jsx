import {
  FaLinkedinIn,
  FaWhatsapp,
  FaGithub,
  FaPhone,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0e0a2f] text-white font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Column 1: Branding & Description */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/assets/Logo1.png" alt="Study Desk Logo" className="h-14 brightness-0 invert" />
              <span className="text-2xl font-bold text-white tracking-wide">Study Desk</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg max-w-sm">
              Study Desk is your ultimate learning companion, providing AI-powered assistance and resources to master any subject. Join thousands of students nationwide.
            </p>

          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-4 md:pl-12">
            <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-blue-600 pl-4 uppercase tracking-widest">Explore</h3>
            <ul className="grid grid-cols-1 gap-y-4 gap-x-8">
              {[
                { name: "About Us", link: "/about" },
                { name: "Contact Us", link: "/contact" },
                { name: "Privacy Policy", link: "/privacy" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.link} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="md:col-span-4">
            <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-blue-600 pl-4 uppercase tracking-widest">Get In Touch</h3>
            <div className="space-y-4">
              <a href="mailto:garvitdani@gmail.com" className="flex items-center gap-4 group cursor-pointer group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-blue-600 transition-colors">
                  <span className="text-sm italic font-bold">@</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-tighter">Email Us</p>
                  <p className="text-gray-300 font-medium group-hover:text-blue-400">garvitdani@gmail.com</p>
                </div>
              </a>

              <a href="tel:9575368173" className="flex items-center gap-4 group cursor-pointer group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-blue-600 transition-colors">
                  <FaPhone size={14} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-tighter">Call Us</p>
                  <p className="text-gray-300 font-medium group-hover:text-blue-400">9575368173</p>
                </div>
              </a>

              <div className="flex gap-4 pt-2">
                {[
                  { Icon: FaWhatsapp, link: "https://wa.me/919575368173" },
                  { Icon: FaLinkedinIn, link: "https://www.linkedin.com/in/garvit-dani/" },
                  { Icon: FaGithub, link: "https://github.com/Garvit-developer" }
                ].map(({ Icon, link }, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target={link === "#" ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-1 transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5 bg-[#0a0724]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        <div className="px-6 md:px-12 py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
            <p>© 2026 Study Desk. All rights reserved.</p>
            <div className="flex gap-8">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
