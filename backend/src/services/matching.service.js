const User = require('../models/User');
const Connection = require('../models/Connection');

/**
 * Returns suggested students based on shared skills and interests
 * @param {object} currentUser - The logged-in user
 * @param {number} limit - Max suggestions
 */
const getSuggestions = async (currentUser, limit = 10) => {
  try {
    const { skills = [], interests = [], _id: userId } = currentUser;

    // Get existing connections to exclude
    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }]
    }).select('requester recipient');

    const excludedIds = new Set([userId.toString()]);
    connections.forEach(c => {
      excludedIds.add(c.requester.toString());
      excludedIds.add(c.recipient.toString());
    });

    // Find users with matching skills/interests
    const suggestions = await User.find({
      _id: { $nin: Array.from(excludedIds) },
      role: 'student',
      isActive: true,
      $or: [
        { skills: { $in: skills } },
        { interests: { $in: interests } }
      ]
    })
      .select('name photo registrationNumber branch year skills interests bio')
      .limit(limit);

    // Score by match count
    const scored = suggestions.map(user => {
      const skillMatches = user.skills.filter(s => skills.includes(s)).length;
      const interestMatches = user.interests.filter(i => interests.includes(i)).length;
      return { ...user.toObject(), matchScore: skillMatches + interestMatches };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return scored;
  } catch (error) {
    console.error('Matching service error:', error.message);
    return [];
  }
};

module.exports = { getSuggestions };
