/**
 * Build pagination metadata from query params
 * @param {object} query - Express request query
 * @param {number} total - Total document count
 * @returns {{ page, limit, skip, totalPages, total }}
 */
const paginate = (query, total) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  return { page, limit, skip, totalPages, total };
};

/**
 * Build standard paginated response
 */
const paginatedResponse = (data, meta) => ({
  success: true,
  data,
  pagination: {
    page: meta.page,
    limit: meta.limit,
    total: meta.total,
    totalPages: meta.totalPages,
    hasNext: meta.page < meta.totalPages,
    hasPrev: meta.page > 1
  }
});

module.exports = { paginate, paginatedResponse };
