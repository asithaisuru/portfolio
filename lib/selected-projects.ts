/** Curated descriptions remain available when the live GitHub feed cannot load. */
export const selectedProjects = [
  {
    name: 'Quartz Optimizer', repository: 'quartz-optimizer',
    stack: 'Python · FastAPI · React · COLMAP · OpenCV · Open3D',
    description: 'A photogrammetry reconstruction prototype with CUDA-capable components, background masking, mesh processing and interactive inspection. Computational cutting optimization is separate research software.',
  },
  {
    name: 'Waveio', repository: 'lan-play',
    stack: 'React · Express · Socket.IO · SQLite · PostgreSQL · Redis',
    description: 'LAN/cloud music rooms with persistent queues, synchronized playback state, host recovery, browser announcements and one assigned audio device. SQLite/PostgreSQL persistence and Redis event distribution have local integration coverage.',
  },
  {
    name: 'Project Oasis', repository: 'project_oasis',
    stack: 'React · Express · MongoDB · JWT · Tailwind CSS',
    description: 'A staff administration platform with QR-assisted attendance, student records, grade publication, fee tracking, generated email confirmations and indexed MongoDB models.',
  },
  {
    name: 'Interactive Portfolio', repository: 'portfolio',
    stack: 'Next.js · TypeScript · React Three Fiber · Three.js · Tailwind CSS',
    description: 'An interactive 3D story and GitHub project explorer, with a direct recruiter summary, reduced-motion support and a non-WebGL path.',
  },
] as const;
