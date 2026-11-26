'use client';

import { Briefcase, GraduationCap } from 'lucide-react';

export default function Experience() {
  return (
    <section id="experience" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Experience & Education</h2>
          <p className="text-xl text-gray-400">My professional journey and academic background</p>
        </div>

        {/* Work Experience */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Briefcase className="text-purple-400" size={28} />
            Work Experience
          </h3>

          <div className="space-y-8">
            <div className="glass-hover rounded-xl p-8 border border-purple-500/20 relative overflow-hidden fade-in-up">
              <h4 className="text-xl font-bold text-white mb-2">IT Intern (Full-Stack Software Engineering)</h4>
              <p className="text-purple-300 font-medium">KeenRabbits (Pvt) Ltd, Gampaha</p>
              <p className="text-sm text-gray-400 mt-2">April 2026 – Present · Full-time</p>
              <p className="mt-4 text-gray-300">Developing digital library and property platforms with TypeScript, NestJS, Next.js, Laravel and Prisma/MariaDB, including payment/invoicing, access-control, notification and private asset workflows.</p>
            </div>
            {/* Job */}
            <div className="glass-hover rounded-xl p-8 border border-purple-500/20 relative overflow-hidden fade-in-up">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-pink-600"></div>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Customer Support Technician</h4>
                  <p className="text-purple-300 font-medium">Dialog Axiata (PVT) LTD, Colombo</p>
                </div>
                <span className="text-sm text-gray-400 mt-2 sm:mt-0">Dec 2021 – May 2022</span>
              </div>

              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-purple-400 flex-shrink-0 mt-1">•</span>
                  <span>Diagnosed and resolved systems, hardware, and network connectivity issues for internal staff, minimizing workflow disruptions.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 flex-shrink-0 mt-1">•</span>
                  <span>Set up and configured employee devices, ensuring seamless onboarding processes.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-400 flex-shrink-0 mt-1">•</span>
                  <span>Managed IT support tickets and escalated complex technical issues.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <GraduationCap className="text-cyan-400" size={28} />
            Education
          </h3>

          <div className="space-y-8">
            {/* Degree */}
            <div className="glass-hover rounded-xl p-8 border border-purple-500/20 relative overflow-hidden fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-600 to-blue-600"></div>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">B.Sc. (Hons) in Industrial Information Technology</h4>
                  <p className="text-purple-300 font-medium">Uva Wellassa University of Sri Lanka</p>
                </div>
                <span className="text-sm text-gray-400 mt-2 sm:mt-0">Expected June–July 2027</span>
              </div>

              <div className="mb-4">
                <p className="text-gray-300 mb-2"><span className="text-cyan-300 font-semibold">GPA to date:</span> 3.54 · Coursework completed; final results pending.</p>
                <p className="text-gray-400 text-sm">Relevant Coursework: OOP, Software Engineering, DBMS, Web Application Development, Data Structures &amp; Algorithms, Software Quality Assurance</p>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mt-12 glass-hover rounded-xl p-8 border border-purple-500/20 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-bold text-white mb-4">Professional Summary</h4>
            <p className="text-gray-300 leading-relaxed">
              Industrial Information Technology undergraduate with coursework completed and final results pending. Full-stack development with TypeScript, Next.js, NestJS and Laravel, alongside computer vision and 3D reconstruction research. Available for immediate full-time software engineering opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
