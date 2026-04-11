"use client";

import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Link from "next/link";
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#050505] text-neutral-300 border-t border-neutral-800">
      
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              CodeSync AI
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Real-time collaborative coding platform with AI assistance.
              Code together, instantly.
            </p>
          </div>

          <div className="md:ml-auto"> 
            <h4 className="text-sm font-semibold text-neutral-200 mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="hover:text-white cursor-pointer transition-colors w-fit"><Link href="/">Home</Link></li>
              <li className="hover:text-white cursor-pointer transition-colors w-fit">Features</li>
              <li className="hover:text-white cursor-pointer transition-colors w-fit">About</li>
            </ul>
          </div>

          <div className="md:ml-auto">
            <h4 className="text-sm font-semibold text-neutral-200 mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <FaEnvelope className="text-neutral-500" /> 
                <span>support@codesync.ai</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <FaPhoneAlt className="text-neutral-500" /> 
                <span>+91 90581 45299</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <FaMapMarkerAlt className="text-neutral-500" /> 
                <span>India</span>
              </li>
            </ul>
          </div>

          <div className="md:ml-auto">
            <h4 className="text-sm font-semibold text-neutral-200 mb-4 uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="flex gap-5 text-xl text-neutral-400">
              <Link href="https://x.com/home" target="_blank"><FaTwitter className="hover:text-white transition-all hover:-translate-y-1 cursor-pointer" /></Link>
              <Link href="https://www.linkedin.com/in/ujjwal-gupta-52a466336/" target="_blank"><FaLinkedin className="hover:text-white transition-all hover:-translate-y-1 cursor-pointer" /></Link>
              <Link href="https://github.com/ujjwal2205" target="_blank"><FaGithub className="hover:text-white transition-all hover:-translate-y-1 cursor-pointer" /></Link>
            </div>
          </div>

        </div>
        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wide text-neutral-500">
          <p>© {year} CodeSync AI. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}