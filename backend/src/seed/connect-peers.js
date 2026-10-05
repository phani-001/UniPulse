require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Connection = require('../models/Connection');
const Message = require('../models/Message');

async function connectPeers() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const phani = await User.findOne({ registrationNumber: '23331A1285' });
  const arjun = await User.findOne({ registrationNumber: '21CS001' });
  const priya = await User.findOne({ registrationNumber: '21CS002' });

  if (phani && arjun) {
    await Connection.findOneAndUpdate(
      {
        $or: [
          { requester: phani._id, recipient: arjun._id },
          { requester: arjun._id, recipient: phani._id }
        ]
      },
      {
        requester: arjun._id,
        recipient: phani._id,
        status: 'accepted',
        note: 'Hey Phani! Welcome to MVGRCE UniPulse.'
      },
      { upsert: true, new: true }
    );

    // Add a greeting message from Arjun to Phani
    const existingMsg = await Message.findOne({ sender: arjun._id, recipient: phani._id });
    if (!existingMsg) {
      await Message.create({
        sender: arjun._id,
        recipient: phani._id,
        content: 'Hi Phani! Welcome to MVGR. We are forming a team for the upcoming HackFest 2024. Let me know if you would like to join!'
      });
    }
    console.log('✅ Connected Phani with Arjun Sharma + added initial message');
  }

  if (phani && priya) {
    await Connection.findOneAndUpdate(
      {
        $or: [
          { requester: phani._id, recipient: priya._id },
          { requester: priya._id, recipient: phani._id }
        ]
      },
      {
        requester: priya._id,
        recipient: phani._id,
        status: 'accepted',
        note: 'Excited to connect for UI/UX and web development!'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Connected Phani with Priya Patel');
  }

  await mongoose.disconnect();
  console.log('Done!');
}

connectPeers().catch(err => {
  console.error(err);
  process.exit(1);
});
