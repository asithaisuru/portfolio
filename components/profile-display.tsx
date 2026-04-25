'use client';

import Image from 'next/image';

interface ProfileDisplayProps {
  imagePath?: string;
}

export function ProfileDisplay({ imagePath = '/placeholder-user.jpg' }: ProfileDisplayProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="profile-avatar rounded-full overflow-hidden bg-card">
        <Image
          src={imagePath}
          alt="Profile Picture"
          width={250}
          height={250}
          priority
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
