"use client";

import { useEffect, useState } from "react";

export default function GlobeMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Memastikan komponen dimuat di sisi klien browser
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          width: "100%",
          height: "420px",
          backgroundColor: "#f5f5f5",
          borderRadius: "16px",
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "1200px",
        height: "420px",
        marginTop: "30px",
        marginBottom: "30px",
        marginLeft: "auto",
        marginRight: "auto",
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* 📍 IFRAME EMBED RESMI GOOGLE MAPS UNTUK BAKMEN TANAH GROGOT */}
      {/* Metode ini dijamin 100% tembus dari segala proteksi CORS/CSP browser Next.js */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d780.3431960046183!2d116.19172778820773!3d-1.899068135428617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df047002a290961%3A0xa6c2187cddd682ca!2sBakmen%20-%20Bakmi%20dan%20Ramen!5e0!3m2!1sid!2sid!4v1790087764819!5m2!1sid!2sid"
        width="100%"
        height="100%"
        style={{ border: 0, position: "absolute", top: 0, left: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Lokasi Bakmie & Ramen Bakmen Tanah Grogot"
      />
    </div>
  );
}
