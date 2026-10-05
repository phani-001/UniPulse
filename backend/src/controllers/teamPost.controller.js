const TeamPost = require('../models/TeamPost');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { paginate, paginatedResponse } = require('../utils/pagination');

// GET /api/v1/team-posts
const getTeamPosts = asyncHandler(async (req, res) => {
  const { skill, isOpen } = req.query;
  const filter = {};

  if (skill) filter.skillsNeeded = { $in: [new RegExp(skill, 'i')] };
  if (isOpen !== undefined) filter.isOpen = isOpen === 'true';

  const total = await TeamPost.countDocuments(filter);
  const meta = paginate(req.query, total);

  const posts = await TeamPost.find(filter)
    .populate('author', 'name photo branch year registrationNumber')
    .populate('event', 'title startDate')
    .sort({ createdAt: -1 })
    .skip(meta.skip)
    .limit(meta.limit);

  res.json(paginatedResponse(posts, meta));
});

// POST /api/v1/team-posts
const createTeamPost = asyncHandler(async (req, res) => {
  const { title, event, eventName, description, skillsNeeded, teamSize } = req.body;

  const post = await TeamPost.create({
    author: req.user._id,
    title,
    event,
    eventName,
    description,
    skillsNeeded,
    teamSize
  });

  await post.populate('author', 'name photo branch year');
  res.status(201).json({ success: true, data: post });
});

// GET /api/v1/team-posts/:id
const getTeamPost = asyncHandler(async (req, res) => {
  const post = await TeamPost.findById(req.params.id)
    .populate('author', 'name photo branch year registrationNumber')
    .populate('event', 'title startDate type')
    .populate('respondents', 'name photo branch year');

  if (!post) throw ApiError.notFound('Team post not found');
  res.json({ success: true, data: post });
});

// POST /api/v1/team-posts/:id/respond
const respondToTeamPost = asyncHandler(async (req, res) => {
  const post = await TeamPost.findById(req.params.id);
  if (!post) throw ApiError.notFound('Team post not found');
  if (!post.isOpen) throw ApiError.badRequest('This team post is no longer accepting responses');

  const alreadyResponded = post.respondents.includes(req.user._id);
  if (alreadyResponded) throw ApiError.conflict('You have already responded');

  post.respondents.push(req.user._id);
  await post.save();

  res.json({ success: true, message: 'Response sent to team post author' });
});

// DELETE /api/v1/team-posts/:id
const deleteTeamPost = asyncHandler(async (req, res) => {
  const post = await TeamPost.findOne({ _id: req.params.id, author: req.user._id });
  if (!post) throw ApiError.notFound('Post not found or you are not the author');
  await post.deleteOne();
  res.json({ success: true, message: 'Post deleted' });
});

// GET /api/v1/team-posts/my
const getMyTeamPosts = asyncHandler(async (req, res) => {
  const posts = await TeamPost.find({ author: req.user._id })
    .populate('event', 'title')
    .populate('respondents', 'name photo')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: posts });
});

module.exports = { getTeamPosts, createTeamPost, getTeamPost, respondToTeamPost, deleteTeamPost, getMyTeamPosts };
