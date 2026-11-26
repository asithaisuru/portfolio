import type { Metadata } from 'next';
import Link from 'next/link';
import { selectedProjects } from '@/lib/selected-projects';

export const metadata: Metadata = {
  title: 'Asitha Isuru | Software Engineer & Full-Stack Developer',
  description: 'Skills, education, experience, selected software projects and contact links in a fast, accessible overview.',
};

export default function RecruiterSummary() {
  return (
    <main id="main-content" className="recruiter-page min-h-screen bg-[#f9f5e9] px-6 py-10 text-[#20344c] sm:px-10">
      <div className="mx-auto max-w-4xl space-y-10">
        <nav aria-label="Summary navigation" className="flex flex-wrap gap-4 text-sm font-bold">
          <Link href="/">Explore the 3D story</Link><a href="#selected-projects">Selected projects</a><a href="#recruiter-contact">Contact</a>
        </nav>
        <header className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-widest text-[#287468]">Recruiter summary</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Asitha Isuru</h1>
          <p className="text-xl font-bold">Software Engineer | Full-Stack Developer</p>
          <p className="max-w-3xl text-lg leading-relaxed">Industrial Information Technology undergraduate with coursework completed and final results pending. I develop full-stack business applications with TypeScript, Next.js, NestJS and Laravel, including payment, real-time and database workflows, alongside research in computer vision and 3D reconstruction. Available for immediate full-time software engineering opportunities.</p>
          <div className="flex flex-wrap gap-4 font-bold">
            <a className="rounded-full bg-[#243d61] px-5 py-3 text-white" href="/Asitha_Isuru_Public_CV.pdf" download>Download public CV (PDF)</a>
            <a className="rounded-full border border-[#243d61] px-5 py-3" href="https://github.com/asithaisuru">GitHub</a>
            <a className="rounded-full border border-[#243d61] px-5 py-3" href="https://www.linkedin.com/in/asithaisuru">LinkedIn</a>
          </div>
        </header>
        <section aria-labelledby="skills-heading" className="space-y-3">
          <h2 id="skills-heading" className="text-2xl font-black">Skills</h2>
          <p className="leading-relaxed"><strong>Languages:</strong> TypeScript, JavaScript, PHP, Python, SQL, HTML5 and CSS3.</p>
          <p className="leading-relaxed"><strong>Frontend:</strong> Next.js, React, Tailwind CSS, Three.js, React Three Fiber and responsive interfaces.</p>
          <p className="leading-relaxed"><strong>Backend and security:</strong> NestJS, Laravel, Node.js, Express.js, FastAPI, REST APIs, Socket.IO, WebSockets, Laravel Reverb, JWT, RBAC and MFA.</p>
          <p className="leading-relaxed"><strong>Databases and ORM:</strong> MariaDB, PostgreSQL, MongoDB, SQLite, Redis, Prisma ORM, schema design, query optimization and migrations.</p>
          <p className="leading-relaxed"><strong>Cloud and engineering:</strong> AWS S3, IAM, Linux VPS, Docker, Git, GitHub Actions, CI/CD, Playwright, unit/integration/regression/API testing and Agile/Scrum.</p>
          <p className="leading-relaxed"><strong>Computer vision:</strong> PyTorch, OpenCV, Open3D, COLMAP and CUDA-capable processing components.</p>
        </section>
        <section aria-labelledby="experience-heading" className="space-y-4">
          <h2 id="experience-heading" className="text-2xl font-black">Professional experience</h2>
          <article><h3 className="font-bold">IT Intern (Full-Stack Software Engineering) · KeenRabbits (Pvt) Ltd</h3><p>April 2026 – Present · Full-time · Gampaha</p><p className="mt-2 leading-relaxed">Modular services and responsive interfaces for digital library and property platforms using TypeScript, NestJS, Next.js, Laravel and Prisma/MariaDB. Work includes PayHere payment/invoicing workflows, approval-based refund settlements, outbox events, RBAC/MFA, notifications, private asset delivery and catalogue filtering.</p></article>
          <article><h3 className="font-bold">Customer Support Technician · Dialog Axiata (Pvt) Ltd</h3><p>December 2021 – May 2022 · Full-time · Colombo</p><p className="mt-2 leading-relaxed">Hardware, operating-system and network troubleshooting, workstation configuration and ticket support.</p></article>
        </section>
        <section aria-labelledby="education-heading" className="space-y-3">
          <h2 id="education-heading" className="text-2xl font-black">Education</h2>
          <p className="font-bold">B.Sc. (Hons) in Industrial Information Technology</p><p>Uva Wellassa University of Sri Lanka</p>
          <p>Coursework completed; final results pending. Expected graduation: June–July 2027.</p>
          <p>2020/2021 intake · GPA to date: 3.54.</p>
          <p className="leading-relaxed">Relevant coursework: OOP, Software Engineering, DBMS, Web Application Development, Data Structures &amp; Algorithms, and Software Quality Assurance.</p>
          <h3 className="pt-2 font-bold">Certification</h3>
          <p>Oracle AI Vector Search Certified Professional (1Z0-184-25) · Issued 16 May 2025.</p>
        </section>
        <section id="selected-projects" aria-labelledby="projects-heading" className="space-y-5">
          <h2 id="projects-heading" className="text-2xl font-black">Selected projects</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {selectedProjects.map((project) => (
              <article key={project.repository} className="space-y-3 rounded-3xl border border-[#cbdad2] bg-white p-6">
                <h3 className="text-xl font-black"><a href={`https://github.com/asithaisuru/${project.repository}`}>{project.name}</a></h3>
                <p className="text-sm font-semibold text-[#287468]">{project.stack}</p><p className="leading-relaxed">{project.description}</p>
                <a className="inline-block font-bold underline underline-offset-4" href={`https://github.com/asithaisuru/${project.repository}`}>View source</a>
              </article>
            ))}
          </div>
        </section>
        <section id="recruiter-contact" aria-labelledby="contact-heading" className="space-y-3 border-t border-[#cbdad2] pt-6">
          <h2 id="contact-heading" className="text-2xl font-black">Contact</h2>
          <a className="font-bold underline underline-offset-4" href="mailto:asithafree1@gmail.com">asithafree1@gmail.com</a>
          <p>Sri Lanka · <a href="https://www.linkedin.com/in/asithaisuru">Connect on LinkedIn</a></p>
        </section>
      </div>
    </main>
  );
}
