import {
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0e0a2f] text-white font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Column 1: Branding & Description */}
          <div className="md:col-span-4 space-y-6">
            <img src="/study_desk_logo.png" alt="Study Desk Logo" className="h-12 brightness-0 invert" />
            <p className="text-gray-400 leading-relaxed text-lg max-w-sm">
              Study Desk is your ultimate learning companion, providing AI-powered assistance and resources to master any subject. Join thousands of students nationwide.
            </p>
            <div className="flex gap-4 pt-2">
              {[FaFacebookF, FaWhatsapp, FaLinkedinIn, FaInstagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-4 md:pl-12">
            <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-blue-600 pl-4 uppercase tracking-widest">Explore</h3>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
              {[
                { name: "About Us", link: "#" },
                { name: "Resources", link: "#" },
                { name: "Courses", link: "#" },
                { name: "Community", link: "#" },
                { name: "Success Stories", link: "#" },
                { name: "Testimonials", link: "#" }
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.link} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="md:col-span-4">
            <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-blue-600 pl-4 uppercase tracking-widest">Support</h3>
            <div className="space-y-4">
              <a href="mailto:support@studydesk.ai" className="flex items-center gap-4 group cursor-pointer group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-blue-600 transition-colors">
                  <span className="text-sm italic font-bold">@</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-tighter">Email Us</p>
                  <p className="text-gray-300 font-medium group-hover:text-blue-400">support@studydesk.ai</p>
                </div>
              </a>
              <div className="pt-4">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                >
                  Get Help Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 px-6 md:px-12 py-8 bg-[#0a0724]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
          <p>© 2024 Study Desk. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-400 transition-colors">Term of Use</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
