'use client';

import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass border-t border-purple-500/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-bold gradient-text mb-2">Asitha Isuru</div>
            <p className="text-gray-400 text-sm">Full-Stack Developer | Computer Vision Enthusiast</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2 flex flex-col">
              <a href="#about" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                About
              </a>
              <a href="#projects" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Projects
              </a>
              <a href="#skills" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Skills
              </a>
              <a href="#contact" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Contact
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Find Me</h4>
            <div className="space-y-2">
              <a
                href="https://github.com/asithaisuru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/asithaisuru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2"
              >
                LinkedIn
              </a>
              <a
                href="mailto:asithafree1@gmail.com"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              Made with <Heart size={16} className="text-pink-500" /> by Asitha Isuru
            </p>
            <p className="text-gray-500 text-xs mt-4 sm:mt-0">
              © {currentYear} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
