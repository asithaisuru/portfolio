'use client';

import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { ProfileDisplay } from './profile-display';

export default function Hero() {



  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 relative overflow-hidden" id='about'>
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Profile Picture Section */}
        <div className="fade-in-up" style={{ animationDelay: '0s' }}>
          <ProfileDisplay imagePath="https://avatars.githubusercontent.com/u/132634001?v=4" />
        </div>

        {/* Animated badge */}
        <div className="inline-block mb-6 fade-in-up">
          <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
            👨‍💻 Software Engineer | Full-Stack Developer
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Hi, I&apos;m <span className="gradient-text">Asitha Isuru</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Building intelligent solutions with the MERN stack and computer vision. Transforming ideas into impactful applications.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <a
            href="#projects"
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 glow"
          >
            View My Work <ArrowRight size={20} />
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-primary/50 text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all duration-300 hover:border-primary/75"
          >
            Get in Touch
          </a>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="https://github.com/asithaisuru"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:text-foreground hover:border-primary/50 hover:bg-primary/20 transition-all duration-300"
            aria-label="GitHub"
          >
            <Github size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/asithaisuru"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:text-foreground hover:border-primary/50 hover:bg-primary/20 transition-all duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="mailto:asithafree1@gmail.com"
            className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:text-foreground hover:border-primary/50 hover:bg-primary/20 transition-all duration-300"
            aria-label="Email"
          >
            <Mail size={24} />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
