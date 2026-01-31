import { Role, UserStatus } from '../../generated/prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Starting database seeding...');


  // Create Categories
  const categories = [
    {
      name: 'Mathematics',
      slug: 'mathematics',
      description: 'Algebra, Calculus, Geometry, Statistics, and more',
      icon: '🔢',
    },
    {
      name: 'Programming',
      slug: 'programming',
      description: 'Web Development, Mobile Apps, Data Science, AI/ML',
      icon: '💻',
    },
    {
      name: 'Languages',
      slug: 'languages',
      description: 'English, Spanish, French, Mandarin, and more',
      icon: '🌍',
    },
    {
      name: 'Science',
      slug: 'science',
      description: 'Physics, Chemistry, Biology, Environmental Science',
      icon: '🔬',
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Marketing, Finance, Accounting, Management',
      icon: '💼',
    },
    {
      name: 'Music',
      slug: 'music',
      description: 'Piano, Guitar, Vocal Training, Music Theory',
      icon: '🎵',
    },
    {
      name: 'Art & Design',
      slug: 'art-design',
      description: 'Drawing, Painting, Graphic Design, UI/UX',
      icon: '🎨',
    },
    {
      name: 'Test Preparation',
      slug: 'test-preparation',
      description: 'SAT, ACT, GRE, GMAT, IELTS, TOEFL',
      icon: '📝',
    },
  ];


  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log('✅ Categories created');


  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });