import { IOpportunity } from './types';

export const INITIAL_OPPORTUNITIES: Array<Omit<IOpportunity, '_id' | 'createdAt' | 'updatedAt'>> = [
  {
    title: 'Smart India Hackathon 2026',
    description:
      'National initiative to provide students a platform to solve some of the pressing problems faced in daily lives, and thus inculcate a culture of product innovation and a mindset of problem-solving.',
    category: 'Hackathon',
    deadline: '2026-10-25T23:59:59.000Z',
    applicationLink: 'https://www.sih.gov.in',
    source: 'user_submission',
    isFeatured: true,
  },
  {
    title: 'Google Summer of Code 2026',
    description:
      'A global, online program focused on bringing new contributors into open source software development. Contributors work with an open source organization on a 12+ week programming project.',
    category: 'Internship',
    deadline: '2026-11-15T18:00:00.000Z',
    applicationLink: 'https://summerofcode.withgoogle.com',
    source: 'user_submission',
    isFeatured: true,
  },
  {
    title: 'MLH Global Hack Week: Open Source',
    description:
      'A week-long hackathon event hosted by Major League Hacking. Attend technical workshops, complete daily mini-challenges, and collaborate on real open-source repositories.',
    category: 'Hackathon',
    deadline: '2026-10-05T20:00:00.000Z',
    applicationLink: 'https://globalhackweek.mlh.io',
    source: 'external_api',
    isFeatured: true,
  },
  {
    title: 'AWS Cloud Practitioner Student Bootcamp',
    description:
      'Hands-on interactive weekend workshop for university students covering AWS core services, architecture principles, security, and preparation for the Cloud Practitioner exam.',
    category: 'Workshop',
    deadline: '2026-09-30T12:00:00.000Z',
    applicationLink: 'https://aws.amazon.com/training',
    source: 'user_submission',
    isFeatured: false,
  },
  {
    title: 'Microsoft Imagine Cup 2026',
    description:
      'Global student competition giving young developers the opportunity to bring their tech ideas to life with Microsoft Azure AI and compete for global mentorship and prizes.',
    category: 'Competition',
    deadline: '2026-12-01T23:59:59.000Z',
    applicationLink: 'https://imaginecup.microsoft.com',
    source: 'user_submission',
    isFeatured: true,
  },
  {
    title: 'Linux Foundation Mentorship Program (LFX)',
    description:
      'Paid remote internship mentorships for students and aspiring developers to contribute to active Linux Foundation open source projects under experienced maintainers.',
    category: 'Internship',
    deadline: '2026-10-18T17:00:00.000Z',
    applicationLink: 'https://lfx.linuxfoundation.org/tools/mentorship',
    source: 'user_submission',
    isFeatured: false,
  },
  {
    title: 'ACM ICPC Regional Contest 2026',
    description:
      'The premier competitive programming contest for university students worldwide. Teams of three solve complex algorithmic and mathematical programming problems under time limits.',
    category: 'Competition',
    deadline: '2026-11-10T23:59:59.000Z',
    applicationLink: 'https://icpc.global',
    source: 'user_submission',
    isFeatured: false,
  },
  {
    title: 'Next.js & Modern Web Architecture Summit',
    description:
      'Free community developer conference featuring deep-dives into Server Components, streaming SSR, performance optimization, and full-stack TypeScript architectures.',
    category: 'Event',
    deadline: '2026-10-12T09:00:00.000Z',
    applicationLink: 'https://nextjs.org/conf',
    source: 'external_api',
    isFeatured: false,
  },
];
