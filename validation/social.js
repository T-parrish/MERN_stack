// Strips http:// and https:// from social link strings
// allows for downstream flexibilty for display and security

module.exports = function removeProtocol(str) {
  return str.replace(/(^\w+:|^)\/\//, '');
}