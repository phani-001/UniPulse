const Notification = require('../models/Notification');

/**
 * Creates an in-app notification
 * @param {object} data - { recipient, type, title, message, link?, relatedModel?, relatedId? }
 */
const create = async (data) => {
  try {
    await Notification.create(data);
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    // Never let notification failure break the main flow
  }
};

/**
 * Creates notifications for all members of a club
 * @param {string} clubId
 * @param {object} notifData - notification payload without recipient
 */
const notifyClubMembers = async (clubId, notifData) => {
  try {
    const ClubMembership = require('../models/ClubMembership');
    const memberships = await ClubMembership.find({ club: clubId, status: 'active' }).select('user');
    const notifications = memberships.map(m => ({
      ...notifData,
      recipient: m.user
    }));
    if (notifications.length) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('Failed to notify club members:', error.message);
  }
};

module.exports = { create, notifyClubMembers };
