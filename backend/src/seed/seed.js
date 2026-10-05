require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Club = require('../models/Club');
const ClubMembership = require('../models/ClubMembership');
const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Result = require('../models/Result');

const studentsData = require('./data/students.json');
const clubsData = require('./data/clubs.json');
const eventsData = require('./data/events.json');
const announcementsData = require('./data/announcements.json');
const resultsData = require('./data/results.json');

const DEFAULT_PASSWORD = 'UniPulse@123';

async function seed(disconnectOnComplete = false) {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
  console.log('\n🌱 Starting seed...\n');

  // Clear existing clubs, events, announcements, results (preserve custom registered users)
  await Promise.all([
    Club.deleteMany({}),
    ClubMembership.deleteMany({}),
    Announcement.deleteMany({}),
    Event.deleteMany({}),
    Result.deleteMany({})
  ]);
  console.log('🗑️  Cleared existing clubs, events, announcements, and results');

  // 1. Create or retrieve system admin user
  let adminUser = await User.findOne({ registrationNumber: 'ADMIN001' });
  if (!adminUser) {
    adminUser = await User.create({
      registrationNumber: 'ADMIN001',
      password: 'Admin@UniPulse123',
      role: 'admin',
      name: 'System Admin',
      isFirstLogin: false
    });
    console.log('👤 Created admin user (ADMIN001 / Admin@UniPulse123)');
  } else {
    console.log('👤 Using existing admin user (ADMIN001)');
  }

  // 2. Seed sample students (without removing custom registered users)
  const studentMap = {};
  for (const s of studentsData) {
    let student = await User.findOne({ registrationNumber: s.registrationNumber });
    if (!student) {
      student = await User.create({
        ...s,
        password: DEFAULT_PASSWORD,
        isFirstLogin: true
      });
    }
    studentMap[s.registrationNumber] = student;
  }
  console.log(`👥 Sample students populated (${Object.keys(studentMap).length} students)`);

  // 3. Seed clubs
  const clubs = await Club.create(
    clubsData.map(c => ({ ...c, coordinators: [] }))
  );
  console.log(`🏛️  Created ${clubs.length} clubs`);

  const clubMap = {};
  clubs.forEach(c => { clubMap[c.name] = c; });

  // 4. Assign coordinators and memberships
  // CodeCraft: Arjun (coord), Aditya (coord), Vikram (member)
  // InnovatAI: Kavya (coord), Arjun (member), Divya (member)
  // CyberShield: Vikram (coord), Aditya (member)
  // SportSync: Rohit (coord), Rahul (member), Sneha (member)
  // Rhythm & Rhapsody: Sneha (coord), Ananya (member)
  // Green Campus: Rahul (coord), Ananya (member)

  const membershipSeeds = [
    { club: 'CodeCraft', reg: '21CS001', role: 'coordinator' },
    { club: 'CodeCraft', reg: '21CS005', role: 'coordinator' },
    { club: 'CodeCraft', reg: '21CI007', role: 'member' },
    { club: 'CodeCraft', reg: '22CS006', role: 'member' },
    { club: 'InnovatAI', reg: '22CS006', role: 'coordinator' },
    { club: 'InnovatAI', reg: '21CS001', role: 'member' },
    { club: 'InnovatAI', reg: '22CS010', role: 'member' },
    { club: 'InnovatAI', reg: '21CS002', role: 'member' },
    { club: 'CyberShield', reg: '21CI007', role: 'coordinator' },
    { club: 'CyberShield', reg: '21CS005', role: 'member' },
    { club: 'SportSync', reg: '21EC003', role: 'coordinator' },
    { club: 'SportSync', reg: '21EE009', role: 'member' },
    { club: 'SportSync', reg: '22ME004', role: 'member' },
    { club: 'Rhythm & Rhapsody', reg: '22ME004', role: 'coordinator' },
    { club: 'Rhythm & Rhapsody', reg: '23CS008', role: 'member' },
    { club: 'Rhythm & Rhapsody', reg: '21CS002', role: 'member' },
    { club: 'Green Campus Initiative', reg: '21EE009', role: 'coordinator' },
    { club: 'Green Campus Initiative', reg: '23CS008', role: 'member' },
    { club: 'RoboPulse', reg: '21EC003', role: 'coordinator' },
    { club: 'RoboPulse', reg: '21CS001', role: 'member' },
    { club: 'PixelCraft Studio', reg: '22ME004', role: 'coordinator' },
    { club: 'PixelCraft Studio', reg: '22CS006', role: 'member' },
    { club: 'VentureSphere (E-Cell)', reg: '21CS005', role: 'coordinator' },
    { club: 'VentureSphere (E-Cell)', reg: '22CS010', role: 'member' },
    { club: 'Aperture Guild', reg: '23CS008', role: 'coordinator' },
    { club: 'Aperture Guild', reg: '21CI007', role: 'member' },
    { club: 'Eloquence Literary Society', reg: '21CS002', role: 'coordinator' },
    { club: 'Eloquence Literary Society', reg: '21EE009', role: 'member' },
    { club: 'FinPulse', reg: '22CS010', role: 'coordinator' },
    { club: 'FinPulse', reg: '21EC003', role: 'member' }
  ];

  const memberships = [];
  for (const m of membershipSeeds) {
    const user = studentMap[m.reg];
    const club = clubMap[m.club];
    if (user && club) {
      memberships.push({
        user: user._id,
        club: club._id,
        role: m.role,
        status: 'active'
      });
    }
  }
  await ClubMembership.insertMany(memberships);

  // Update coordinator info on clubs
  for (const [clubName, club] of Object.entries(clubMap)) {
    const coords = membershipSeeds
      .filter(m => m.club === clubName && m.role === 'coordinator')
      .map(m => ({
        user: studentMap[m.reg]?._id,
        role: 'Coordinator'
      }))
      .filter(c => c.user);
    await Club.findByIdAndUpdate(club._id, {
      coordinators: coords,
      memberCount: membershipSeeds.filter(m => m.club === clubName).length
    });
  }
  console.log('🤝 Created memberships and assigned coordinators');

  // 5. Seed events
  const createdEvents = [];
  for (const e of eventsData) {
    const club = clubMap[e.clubName];
    const { clubName, ...eventData } = e;
    const event = await Event.create({
      ...eventData,
      club: club?._id,
      createdBy: adminUser._id
    });
    createdEvents.push(event);
  }
  const eventMap = {};
  createdEvents.forEach(e => { eventMap[e.title] = e; });
  console.log(`📅 Created ${createdEvents.length} events`);

  // 6. Seed announcements
  for (const a of announcementsData) {
    const club = a.clubName ? clubMap[a.clubName] : null;
    const { clubName, ...announcementData } = a;
    await Announcement.create({
      ...announcementData,
      club: club?._id || null,
      createdBy: adminUser._id
    });
  }
  console.log(`📢 Created ${announcementsData.length} announcements`);

  // 7. Seed results (create stub events if needed)
  for (const r of resultsData) {
    // Find or create a past event for result
    let event = createdEvents.find(e => e.title.toLowerCase().includes(r.eventTitle.toLowerCase().split(' ').slice(0, 2).join(' ').toLowerCase()));

    if (!event) {
      // Create a stub past event
      event = await Event.create({
        title: r.eventTitle,
        description: `Past event: ${r.eventTitle}`,
        type: 'competition',
        startDate: new Date(r.weekStart),
        endDate: new Date(r.weekEnd),
        registrationDeadline: new Date(r.weekStart),
        venue: 'Various',
        status: 'completed',
        createdBy: adminUser._id
      });
    }

    const positions = [];
    for (const p of r.positions) {
      const winner = studentMap[p.winnerReg];
      const club = p.clubName ? clubMap[p.clubName] : null;
      positions.push({
        position: p.position,
        winners: winner ? [{ user: winner._id, name: winner.name }] : [{ name: p.winnerReg }],
        club: club?._id,
        points: p.points,
        prize: p.prize
      });

      // Award points to winner
      if (winner) {
        await User.findByIdAndUpdate(winner._id, { $inc: { points: p.points } });
      }
    }

    await Result.create({
      event: event._id,
      week: r.week,
      weekStart: new Date(r.weekStart),
      weekEnd: new Date(r.weekEnd),
      positions,
      publishedBy: adminUser._id,
      isPublished: true
    });
  }
  console.log(`🏆 Created ${resultsData.length} results`);

  console.log('\n✅ Seed completed successfully!\n');
  console.log('📋 Demo Student Credentials:');
  console.log('   Default password: UniPulse@123 (or custom)');
  console.log('   Admin: ADMIN001 / Admin@UniPulse123\n');
  studentsData.forEach(s => {
    console.log(`   ${s.registrationNumber} — ${s.name} (${s.branch})`);
  });
  console.log('\n');

  if (disconnectOnComplete) {
    await mongoose.disconnect();
    process.exit(0);
  }
}

module.exports = seed;

if (require.main === module) {
  seed(true).catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
}

