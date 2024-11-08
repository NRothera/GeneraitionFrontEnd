/** @type {import('next').NextConfig} */
const nextConfig = {
    images : { 
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'generaition.blob.core.windows.net',
                port: ''
            },
        ]
    }
};

export default nextConfig;
