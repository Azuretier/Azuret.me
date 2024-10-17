/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/(.*)', // 画像のパス
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable', // 1年間キャッシュ
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
