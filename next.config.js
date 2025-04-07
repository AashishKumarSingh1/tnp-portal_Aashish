/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // optional but recommended
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
        },
        {
          protocol: 'https',
          hostname: 'web.nitp.ac.in',
        },
        {
          protocol: 'https',
          hostname: 'drive.google.com',
        },
        {
          protocol: 'https',
          hostname: 'i.postimg.cc',
        },
        {
          protocol: 'https',
          hostname: 'www.google.com',
        },
        {
          protocol: 'https',
          hostname: 'media.licdn.com',
        },
        {
          protocol: 'https',
          hostname:'avatars.githubusercontent.com',
        },
        {
          protocol: 'https',
          hostname: 'nitp.ac.in',
        },
        {
          protocol: 'https',
          hostname: 'www.nitp.ac.in',
        },
        
      ],
    },
  };
  
  module.exports = nextConfig;
  