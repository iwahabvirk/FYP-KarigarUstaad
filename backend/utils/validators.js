// Validation utilities
const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.trim().length > 0 && name.length <= 100;
};

// Response formatter
const successResponse = (message, data = null) => {
  return {
    success: true,
    message,
    ...(data && { data }),
  };
};

const errorResponse = (message, statusCode = 500) => {
  return {
    success: false,
    message,
    statusCode,
  };
};

// Pagination helper
const getPaginationParams = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  successResponse,
  errorResponse,
  getPaginationParams,
};
