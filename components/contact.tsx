'use client';

import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mailtoLink = `mailto:asithafree1@gmail.com?subject=Message from ${encodeURIComponent(
      formData.name
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section
      id="contact"
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute top-40 right-20 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Let&apos;s Connect
          </h2>
          <p className="text-xl text-gray-400">
            I&apos;m open to opportunities and collaboration. Feel free to reach
            out!
          </p>
        </div>

        {/* Centered container */}
        <div className="max-w-md mx-auto space-y-10">
          <div className='flex justify-center items-center'>
            <a
              href="/CV - Asitha Isuru - Software Engineer.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-600/50 transition-all duration-300 hover:scale-105"
            >
              Download CV
            </a>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              Get in Touch
            </h3>

            <div className="space-y-4">
              {/* Email */}
              <a
                href="mailto:asithafree1@gmail.com"
                className="glass-hover rounded-lg p-6 border border-purple-500/20 group flex gap-4 cursor-pointer "
              >
                <div className="p-3 rounded-lg bg-purple-600/20 group-hover:bg-purple-600/40 transition-colors">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Email</h4>
                  <p className="text-gray-400 text-sm">
                    asithafree1@gmail.com
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+94784377862"
                className="glass-hover rounded-lg p-6 border border-purple-500/20 group flex gap-4 cursor-pointer "
              >
                <div className="p-3 rounded-lg bg-purple-600/20 group-hover:bg-purple-600/40 transition-colors">
                  <Phone className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Phone</h4>
                  <p className="text-gray-400 text-sm">
                    +94 78 43 77 862
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="glass-hover rounded-lg p-6 border border-purple-500/20 flex gap-4 cursor-pointer ">
                <div className="p-3 rounded-lg bg-purple-600/20">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Location</h4>
                  <p className="text-gray-400 text-sm">
                    Gampaha, Sri Lanka
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Me</h4>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/asithaisuru"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 transition-all duration-300 flex items-center gap-2 group"
              >
                <Github size={20} />
                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  GitHub
                </span>
              </a>

              <a
                href="https://www.linkedin.com/in/asithaisuru"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 transition-all duration-300 flex items-center gap-2 group"
              >
                <Linkedin size={20} />
                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  LinkedIn
                </span>
              </a>
            </div>
          </div>

          {/* OPTIONAL FORM (uncomment if needed) */}
          {/*
          <div className="glass rounded-xl p-8 border border-purple-500/30 text-left">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Send a Message
            </h3>

            {submitted ? (
              <div className="text-center">
                <p className="text-purple-300 font-semibold">
                  Message sent!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-white"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-white"
                />

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Your message..."
                  required
                  className="w-full px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-white"
                />

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
          */}
        </div>
      </div>
    </section>
  );
}