import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Athletes
  const athletes = [
    {
      email: 'maria.silva@example.com',
      name: 'Maria Silva',
      age: 17,
      sport: 'Soccer',
      position: 'Forward',
      bio: 'Rising star in youth soccer. Passionate about the game and looking to take my career to the next level.',
      location: 'São Paulo, Brazil',
      skills: [
        { name: 'Ball Control', level: 9 },
        { name: 'Speed', level: 8 },
        { name: 'Finishing', level: 8 },
      ],
    },
    {
      email: 'james.thompson@example.com',
      name: 'James Thompson',
      age: 22,
      sport: 'Basketball',
      position: 'Point Guard',
      bio: 'College basketball star looking for opportunities in professional leagues.',
      location: 'Los Angeles, USA',
      skills: [
        { name: 'Ball Handling', level: 9 },
        { name: 'Three-Point Shooting', level: 7 },
        { name: 'Court Vision', level: 8 },
      ],
    },
    {
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      age: 19,
      sport: 'Running',
      position: '400m Sprint',
      bio: 'Track and field athlete specializing in 400m. Olympic dreams!',
      location: 'London, UK',
      skills: [
        { name: 'Speed', level: 9 },
        { name: 'Endurance', level: 8 },
        { name: 'Starting Technique', level: 8 },
      ],
    },
    {
      email: 'luis.garcia@example.com',
      name: 'Luis Garcia',
      age: 25,
      sport: 'Soccer',
      position: 'Midfielder',
      bio: 'Experienced midfielder seeking new challenges in European leagues.',
      location: 'Madrid, Spain',
      skills: [
        { name: 'Passing', level: 9 },
        { name: 'Vision', level: 9 },
        { name: 'Stamina', level: 8 },
      ],
    },
    {
      email: 'emma.wilson@example.com',
      name: 'Emma Wilson',
      age: 21,
      sport: 'Basketball',
      position: 'Shooting Guard',
      bio: 'Dynamic shooting guard with a strong work ethic and team spirit.',
      location: 'Sydney, Australia',
      skills: [
        { name: 'Three-Point Shooting', level: 9 },
        { name: 'Defense', level: 7 },
        { name: 'Athleticism', level: 8 },
      ],
    },
    {
      email: 'david.kim@example.com',
      name: 'David Kim',
      age: 15,
      sport: 'Running',
      position: '100m Sprint',
      bio: 'Young sprinter with big potential. Training hard every day!',
      location: 'Seoul, South Korea',
      skills: [
        { name: 'Acceleration', level: 8 },
        { name: 'Explosive Power', level: 7 },
        { name: 'Technique', level: 7 },
      ],
    },
    {
      email: 'sophia.martinez@example.com',
      name: 'Sophia Martinez',
      age: 28,
      sport: 'Soccer',
      position: 'Goalkeeper',
      bio: 'Experienced goalkeeper with international caps. Leader on and off the field.',
      location: 'Barcelona, Spain',
      skills: [
        { name: 'Reflexes', level: 9 },
        { name: 'Shot Stopping', level: 9 },
        { name: 'Distribution', level: 8 },
      ],
    },
    {
      email: 'michael.brown@example.com',
      name: 'Michael Brown',
      age: 30,
      sport: 'Basketball',
      position: 'Power Forward',
      bio: 'Veteran player looking to mentor young talent while competing at high level.',
      location: 'Chicago, USA',
      skills: [
        { name: 'Rebounding', level: 9 },
        { name: 'Post Moves', level: 8 },
        { name: 'Leadership', level: 9 },
      ],
    },
  ];

  for (const athlete of athletes) {
    const user = await prisma.user.create({
      data: {
        email: athlete.email,
        password: hashedPassword,
        profile: {
          create: {
            name: athlete.name,
            type: 'ATHLETE',
            bio: athlete.bio,
            location: athlete.location,
            sport: athlete.sport,
            position: athlete.position,
            birthDate: new Date(new Date().getFullYear() - athlete.age, 0, 1),
            skills: {
              create: athlete.skills,
            },
          },
        },
      },
      include: { profile: true },
    });

    // Create sample posts
    await prisma.post.create({
      data: {
        userId: user.id,
        type: 'TEXT',
        content: `Excited to share my journey in ${athlete.sport}! Looking forward to new opportunities.`,
      },
    });

    console.log(`Created athlete: ${athlete.name}`);
  }

  // Create Scout accounts
  const scouts = [
    {
      email: 'john.scout@sports-agency.com',
      name: 'Elite Sports Agency',
      bio: 'Premier sports agency representing top athletes across multiple disciplines. Looking for the next generation of talent.',
      location: 'New York, USA',
    },
    {
      email: 'talent@fc-academy.com',
      name: 'FC Academy Scouts',
      bio: 'Youth football academy scout. We identify and develop young soccer talent.',
      location: 'Munich, Germany',
    },
    {
      email: 'recruiter@nba-prospects.com',
      name: 'NBA Prospects Recruiting',
      bio: 'Basketball talent scouts for professional leagues. Finding the next basketball stars.',
      location: 'Atlanta, USA',
    },
  ];

  for (const scout of scouts) {
    const user = await prisma.user.create({
      data: {
        email: scout.email,
        password: hashedPassword,
        profile: {
          create: {
            name: scout.name,
            type: 'TEAM',
            bio: scout.bio,
            location: scout.location,
          },
        },
      },
      include: { profile: true },
    });

    await prisma.post.create({
      data: {
        userId: user.id,
        type: 'TEXT',
        content: `We're actively scouting for new talent. Connect with us if you're looking for representation!`,
      },
    });

    console.log(`Created scout: ${scout.name}`);
  }

  console.log('Seeding completed!');
  console.log('\nLogin credentials for all accounts:');
  console.log('Password: password123');
  console.log('\nAthletes:');
  athletes.forEach((a) => console.log(`- ${a.email}`));
  console.log('\nScouts:');
  scouts.forEach((s) => console.log(`- ${s.email}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
