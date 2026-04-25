'use client';

import { Code2, Database, Brain, Network } from 'lucide-react';

export default function Skills() {
  const skillCategories = [
    {
      title: 'Frontend',
      icon: Code2,
      skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Next.js', 'HTML/CSS'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Backend',
      icon: Database,
      skills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'PHP', 'Java'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'AI & CV',
      icon: Brain,
      skills: ['OpenCV', 'PyTorch', 'Machine Learning', '3D Reconstruction', 'Computer Vision', 'TensorFlow'],
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Tools & DevOps',
      icon: Network,
      skills: ['Git/GitHub', 'Linux', 'WebSocket', 'Docker', 'AWS', 'Agile/Scrum'],
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section id="skills" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">Technical Skills</h2>
          <p className="text-xl text-muted-foreground">Technologies and tools I work with</p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.title}
                className="skill-category rounded-xl p-8 group"
                style={{ animationDelay: `${index * 0.1}s`, animation: 'fade-in-up 0.6s ease-out' }}
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} text-foreground`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{category.title}</h3>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill) => (
                    <div
                      key={skill}
                      className="skill-badge rounded-lg px-4 py-2 text-sm font-medium"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold mb-8 text-foreground">Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Oracle Certified Professional',
              'GitHub Foundations',
              'Google Workspace Essentials',
              'Machine Learning with Python',
              'Cisco Networking Academy',
              'NDG Linux Unhatched',
            ].map((cert, index) => (
              <div
                key={cert}
                className="skill-category p-4 rounded-lg text-foreground flex items-center gap-3"
                style={{ animationDelay: `${index * 0.05}s`, animation: 'fade-in-up 0.6s ease-out' }}
              >
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
