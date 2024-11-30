/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    instrumentationHook: true, // used for langsmith tracing
  },
};
