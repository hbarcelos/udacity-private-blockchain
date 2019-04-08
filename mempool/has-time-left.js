function hasTimeLeft({ expiresAt, verifiedAt }) {
  return expiresAt >= verifiedAt;
}

module.exports = hasTimeLeft;
