/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Di Next.js 16, key ini ditaruh di tingkat utama (bukan di dalam experimental)
  allowedDevOrigins: ['192.168.100.235'],
  
  // Konfigurasi Webpack (untuk mode build standar/produksi)
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('/cesium'),
      })
    );
    return config;
  },

  // Mengizinkan Turbopack membaca variabel global CesiumJS saat pnpm dev running
  turbopack: {
    // Membiarkan objek kosong ini agar Turbopack mengizinkan fallback webpack berjalan aman
  }
};

export default nextConfig;
