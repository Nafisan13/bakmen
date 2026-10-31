"use client";

import { FormEvent, MouseEvent, useEffect, useState } from "react";
import GlobeMap from "./components/GlobeMap";
import { menuItems } from "./src/menuData";
import { Color } from "cesium";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const WHATSAPP_ADMIN = "6282190726474";
  const [introVisible, setIntroVisible] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const introShownKey = "bakmen-intro-shown";

    try {
      const alreadyShown =
        window.localStorage.getItem(introShownKey) === "true";

      if (!alreadyShown) {
        setIntroVisible(true);
        document.body.style.overflow = "hidden";
      }
    } catch {
      setIntroVisible(true);
      document.body.style.overflow = "hidden";
    }

    setIntroReady(true);

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!introVisible) return;

    const timer = window.setTimeout(() => {
      setIntroVisible(false);

      try {
        window.localStorage.setItem("bakmen-intro-shown", "true");
      } catch {
        // Abaikan jika localStorage tidak tersedia.
      }

      document.body.style.overflow = "";
    }, 5200);

    return () => window.clearTimeout(timer);
  }, [introVisible]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const revealItems = document.querySelectorAll<HTMLElement>(
      ".section-heading, .gallery-copy, .contact-form, .about-copy",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "300px 0px 300px 0px" },
    );
    revealItems.forEach((item) => observer.observe(item));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const pathToId: Record<string, string> = {
      "/": "home",
      "/menu": "menu",
      "/about": "about",
      "/locations": "locations",
      "/contact": "contact",
    };

    const scrollToPath = () => {
      const id = pathToId[window.location.pathname];
      if (id) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    };

    scrollToPath();
    window.addEventListener("popstate", scrollToPath);
    return () => window.removeEventListener("popstate", scrollToPath);
  }, []);

  function openWhatsApp(message: string) {
    const whatsappUrl = `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  const openPicker = (event: React.MouseEvent<HTMLInputElement>) => {
    const input = event.currentTarget;

    if ("showPicker" in input) {
      try {
        input.showPicker();
      } catch {
        // Browser tidak mendukung showPicker()
      }
    }
  };

  function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nama = String(formData.get("nama") ?? "").trim();
    const nomor = String(formData.get("nomor") ?? "").trim();
    const tanggal = String(formData.get("tanggal") ?? "").trim();
    const waktu = String(formData.get("waktu") ?? "").trim();
    const jumlah = String(formData.get("jumlah") ?? "").trim();
    const catatan = String(formData.get("catatan") ?? "").trim();

    const message = [
      "Halo BAKMEN",
      "",
      "Saya ingin melakukan reservasi tempat.",
      "",
      `Nama: ${nama}`,
      `No. WhatsApp: ${nomor}`,
      `Tanggal: ${tanggal}`,
      `Waktu: ${waktu} WITA`,
      `Jumlah orang: ${jumlah}`,
      `Catatan: ${catatan || "-"}`,
      "",
      "Mohon konfirmasi ketersediaan tempat dan reservasi saya. Terima kasih...",
    ].join("\n");

    openWhatsApp(message);
    event.currentTarget.reset();
  }

  function submitSuggestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nama = String(formData.get("nama") ?? "").trim();
    const saran = String(formData.get("saran") ?? "").trim();

    const message = [
      "Halo BAKMEN",
      "",
      "Saya ingin memberikan saran untuk BAKMEN.",
      "",
      `Nama: ${nama}`,
      `Saran: ${saran}`,
      "",
      "Semoga saran ini dapat membantu BAKMEN menjadi lebih baik. Terima kasih...",
    ].join("\n");

    openWhatsApp(message);
    event.currentTarget.reset();
  }

  function handleNavClick(event: MouseEvent, item: string) {
    event.preventDefault();
    const navIds: Record<string, string> = {
      Beranda: "home",
      "Menu Bakmen": "menu",
      "Tentang Kami": "about",
      Lokasi: "locations",
      Reservasi: "reservation",
    };
    const id = navIds[item] ?? item.toLowerCase();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    const pathById: Record<string, string> = {
      home: "/",
      menu: "/menu",
      about: "/about",
      locations: "/locations",
      reservation: "/reservation",
    };
    const path = pathById[id] ?? `/${id}`;
    window.history.pushState(null, "", path);
    setMenuOpen(false);
  }

  return (
    <>
      {introReady && introVisible && (
        <div
          className="bakmen-intro"
          role="dialog"
          aria-label="Pembukaan BAKMEN"
        >
          <div className="bakmen-intro-content">
            <p className="bakmen-intro-quote">
              ❝ Selama BAKMEN ada..
              <br />
              Selama itu kenikmatan bisa dibentuk kembali. ❞
            </p>
            <p className="bakmen-intro-author">— Kraft Lawrence</p>
            <p className="bakmen-intro-book">Bakmen Nafism.fs (1943)</p>
          </div>
        </div>
      )}

      <main className={introReady ? "" : "bakmen-page-loading"}>
        <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
          <a className="brand" href="#home">
            <img src="/traveland/logo.svg" alt="Bakmen" />
          </a>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Buka atau tutup navigasi"
          >
            ☰
          </button>
          <nav className={menuOpen ? "nav open" : "nav"}>
            {[
              "Beranda",
              "Menu Bakmen",
              "Tentang Kami",
              "Lokasi",
              "Reservasi",
            ].map((item) => (
              <a
                key={item}
                href={`#${
                  (
                    {
                      Beranda: "home",
                      "Menu Bakmen": "menu",
                      "Tentang Kami": "about",
                      Lokasi: "locations",
                      Reservasi: "reservation",
                    } as Record<string, string>
                  )[item]
                }`}
                onClick={(event) => handleNavClick(event, item)}
              >
                {item}
              </a>
            ))}
          </nav>
        </header>

        {/* BERANDA / HERO SECTION */}
        <section id="home" className="hero">
          <div className="hero-overlay" />
          <div className="container hero-content">
            <p className="eyebrow">BAKMI &amp; RAMEN KHAS PASER</p>
            <h1>
              Perpaduan Rasa Bakmi &amp; <span>Ramen</span>
            </h1>
            <p>
              Nikmati bakmi dan ramen dengan cita rasa khas Paser, ditemani
              dimsum dan minuman segar.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* <a className="button" href="#contact">
              Hubungi Kami
            </a> */}

              <a
                className="button-secondary-ig"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #a41240",
                  padding: "8px 12px",
                  borderRadius: "6px",
                }}
                href="https://www.instagram.com/bakmen_bakmi.dan.ramen_paser?stkn=MTR0Z2liampvOGQwMQ=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#eb3b72"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.198-.509.333-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.282.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.668 2.668 0 1 1 0 5.335 2.668 2.668 0 0 1 0-5.335z" />
                </svg>
                Instagram
              </a>
              <a
                className="button-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1px solid #25D366",
                  padding: "8px 12px",
                  borderRadius: "6px",
                }}
                href="https://wa.me/+6282190726474"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="#25D366"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                WhatsApp →
              </a>
            </div>
          </div>
        </section>

        {/* STYLING HAMBURGER MENU DAN NAVIGATION */}
        <style>{`
        @media (max-width: 768px) {
  .menu-toggle {
    font-size: 28px !important;
    color: #ffffff !important;
    background: transparent !important;
    border: none !important;
    padding: 8px 12px !important;
    border-radius: 6px !important;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex !important;
    align-items: center;
    justify-content: center;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  }

  .menu-toggle:hover,
  .menu-toggle:focus {
    transform: scale(1.1);
  }

  .site-header.is-scrolled .menu-toggle {
    color: #000000 !important;
    text-shadow: none;
  }

  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    flex-direction: column;
    padding: 20px 0;
    gap: 0;
    border-top: 2px solid rgba(0, 0, 0, 0.1);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, background 0.3s ease;
  }

  .site-header.is-scrolled .nav {
    background: rgba(0, 0, 0, 0.95);
    border-top: 2px solid rgba(255, 255, 255, 0.1);
  }

  .nav.open {
    max-height: 400px;
  }

  .nav a {
    display: block;
    padding: 14px 20px;
    color: #222222 !important;
    font-size: 16px !important;
    font-weight: 500;
    text-decoration: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .site-header.is-scrolled .nav a {
    color: #ffffff !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav a:hover {
    background: rgba(0, 0, 0, 0.05);
    padding-left: 30px;
  }

  .site-header.is-scrolled .nav a:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .nav a:last-child {
    border-bottom: none;
  }
}
      `}</style>

        {/* KATEGORI HIDANGAN DENGAN 5 CARD LOOP INFINITE CAROUSEL TANPA TEKS PARAGRAF */}
        <section
          id="menu"
          className="section packages"
          style={{ overflow: "hidden" }}
        >
          <div className="container section-heading">
            <p className="eyebrow">JELAJAHI PILIHAN RASA</p>
            <h2>
              Pilihan Menu <span>BAKMEN</span>
            </h2>
            <p>
              Temukan bakmi dengan pilihan topping ayam, ramen dengan beragam
              kuah, aneka dimsum, serta minuman segar untuk menemani hidangan
              anda.
            </p>
          </div>

          {/* STYLING CSS UTK UKURAN CARD KOMPAK DAN PINGGIRAN RAPI TANPA TERPOTONG */}
          <style>{`
          .carousel-container {
            display: flex;
            width: 100%;
            overflow: hidden;
            position: relative;
            margin-top: 30px;
            padding: 10px 0;
          }
          .carousel-track {
            display: flex;
            gap: 50px;
            animation: scrollInfinite 25s linear infinite;
            width: max-content;
          }
          .carousel-container:hover .carousel-track {
            animation-play-state: paused;
          }
          .menu-card {
            width: 400px;
            background: #ffffff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 6px 20px rgba(0,0,0,.7);
            border: 1px solid #f2f2f2;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease;
          }
          .menu-card:hover {
            transform: translateY(-5px);
          }
          .menu-img-wrapper {
              width: 100%;
              height: 600px;
              overflow: hidden;
              position: relative;
          }
          .menu-img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .menu-card-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            background: #ff3535;
            color: #fff;
            padding: 3px 8px;
            border-radius: 5px;
            font-size: 10px;
            font-weight: bold;
            z-index: 2;
          }
          .menu-info {
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
          }
          .menu-info h3 {
            margin: 0;
            font-size: 16px;
            color: #222;
            font-weight: 700;
            text-align: center;
          }
          @keyframes scrollInfinite {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 10px)); }
          }
        `}</style>

          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <a
              className="button"
              href="/menu.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lihat menu BAKMEN dalam format PDF"
            >
              Lihat Detail Menu
            </a>
          </div>

          <div className="carousel-container">
            <div className="carousel-track">
              {[...menuItems, ...menuItems].map((item, index) => (
                <article className="menu-card" key={`${item.id}-${index}`}>
                  <div className="menu-img-wrapper">
                    <span className="menu-card-badge">{item.id}</span>
                    <img src={item.img} alt={item.title} loading="lazy" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TENTANG KAMI / ABOUT SECTION */}
        <section id="about" className="about section">
          <div className="about-image" />
          <div className="container about-copy">
            <div className="content-column">
              <p className="eyebrow">TENTANG BAKMEN</p>
              <h2>
                Kenali <span>BAKMEN</span>
              </h2>
              <p>
                BAKMEN merupakan perpaduan nama bakmi dan ramen yang
                menggabungkan cita rasa bakmi khas Paser. Setiap hidangan
                dikembangkan dengan cita rasa khas Paser.
              </p>
              <style>
                {`
                .button-lojat-menu-bt {
                  font-family: 'DM Sans', sans-serif;
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: transparent;
                  color: red;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: 600;
                  transition: background-color 0.3s ease;
                  border: 2px solid red;
                }
                .button-lojat-menu-bt:hover {
                  background-color: #e62e2e;
                  color: #fff;
                }
              `}
              </style>
              <a className="button-lojat-menu-bt" href="#menu">
                Lihat Menu
              </a>
              <div className="stats">
                {[
                  ["Operasional", "Buka pukul 13.00 - 22.00 WITA"],
                  ["40+", "Tersedia Pilihan Menu"],
                  ["100%", "Bahan Segar"],
                  ["6+", "Karyawan"],
                ].map(([number, label]) => (
                  <div className="stat" key={label}>
                    <strong>{number}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LOKASI RESTORAN */}
        <section
          id="locations"
          className="section services"
          style={{ paddingBottom: "20px" }}
        >
          <div className="container section-heading">
            <p className="eyebrow">TEMUKAN KAMI</p>
            <h2>
              Lokasi <span>BAKMEN</span>
            </h2>
            <p>
              Kunjungi tempat bersantap BAKMEN di Tanah Grogot melalui peta
              berikut.
            </p>
          </div>
          <GlobeMap />
        </section>

        {/* GALERI */}
        <section id="gallery" className="gallery">
          <div className="container gallery-copy">
            <p className="eyebrow">MOMEN BERSAMA BAKMEN</p>
            <h2
              style={{
                color: "white",
                textShadow: "0 0 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              ❝ Selama BAKMEN ada..{" "}
              <span>Selama itu kenikmatan bisa dibentuk kembali. ❞</span>.
            </h2>
            <p className="bakmen-intro-author" style={{ color: "white" }}>
              — Kraft Lawrence
            </p>
            <p className="bakmen-intro-book" style={{ color: "white" }}>
              Bakmen Nafism.fs (1943)
            </p>
          </div>
        </section>

        {/* RESERVASI DAN KONTAK */}
        <section id="reservation" className="section contact">
          <div className="container section-heading">
            <p className="eyebrow">PESANAN &amp; PERTANYAAN</p>
            <h2>
              Mari Terhubung dengan <span>Kami</span>
            </h2>
            <p>
              Hubungi kami untuk bertanya tentang menu, pesanan, atau kebutuhan
              Anda.
            </p>
          </div>
          <form className="contact-form container" onSubmit={submitReservation}>
            <input
              required
              name="nama"
              placeholder="Nama Anda"
              aria-label="Nama"
            />
            <input
              required
              name="nomor"
              type="tel"
              placeholder="Nomor WhatsApp"
              aria-label="Nomor WhatsApp"
            />
            <input
              required
              name="tanggal"
              type="date"
              onClick={openPicker}
              aria-label="Tanggal reservasi"
            />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                required
                name="waktu"
                type="time"
                onClick={openPicker}
                aria-label="Waktu reservasi"
              />
              <span>WITA</span>
            </div>
            <input
              required
              name="jumlah"
              type="number"
              min="1"
              placeholder="Jumlah Orang"
              aria-label="Jumlah orang"
              max="70"
              style={{ gridColumn: "1/-1" }}
            />
            <textarea
              name="catatan"
              placeholder="Catatan tambahan (opsional)"
              aria-label="Catatan tambahan"
              rows={5}
            />
            <button className="button" type="submit">
              Reservasi Sekarang
            </button>
          </form>
        </section>

        {/* kotak saran */}
        <section
          id="saran"
          className="section contact"
          style={{ background: "#e3e1e1" }}
        >
          <div className="container section-heading">
            <p className="eyebrow-saran">Kotak &amp; Saran</p>
            <h2 style={{ color: "#303030" }}>
              Berikan <span style={{ color: "var(--gold)" }}>Saran</span>
            </h2>
            <p>
              Berikan saran untuk kami terkait menu, pesanan, atau kebutuhan
              Anda.
            </p>
          </div>
          <form
            className="contact-form container"
            style={{ gridTemplateColumns: "none" }}
            onSubmit={submitSuggestion}
          >
            <input
              required
              name="nama"
              placeholder="Nama Anda"
              aria-label="Nama"
            />
            <textarea
              required
              name="saran"
              placeholder="Saran Anda"
              aria-label="Saran Anda"
              rows={5}
            />
            <button className="button" type="submit">
              Kirim Saran
            </button>
          </form>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="container">
            <img src="/traveland/logo.svg" alt="Bakmen" />
            <p>© 2026 BAKMEN. Sajian Bakmi dan Ramen, Tanah Grogot Paser.</p>
          </div>
        </footer>
      </main>

      <style>{`
        .bakmen-intro {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          background: #f7f5f0;
          color: #171717;
          text-align: center;
          animation: bakmenIntroFadeIn 1.1s ease-out forwards,
            bakmenIntroFadeOut 1s ease-in 4.2s forwards;
        }

        .bakmen-intro-content {
          width: min(760px, 100%);
          animation: bakmenQuoteReveal 1.5s cubic-bezier(.22, 1, .36, 1) .2s both;
        }

        .bakmen-intro-quote {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(28px, 5vw, 58px);
          line-height: 1.28;
          font-weight: 400;
          letter-spacing: -0.025em;
        }

        .bakmen-intro-author {
          margin: 34px 0 0;
          font-size: 15px;
          letter-spacing: .08em;
          text-transform: uppercase;
          opacity: .75;
        }

        .bakmen-intro-book {
          margin: 8px 0 0;
          font-size: 13px;
          letter-spacing: .04em;
          opacity: .55;
        }

        .bakmen-page-loading {
          visibility: hidden;
        }

        @keyframes bakmenIntroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bakmenQuoteReveal {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bakmenIntroFadeOut {
          from { opacity: 1; }
          to {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bakmen-intro {
            animation: bakmenIntroFadeIn .01s linear forwards;
          }

          .bakmen-intro-content {
            animation: none;
          }
        }

        @media (max-width: 600px) {
          .bakmen-intro {
            padding: 24px;
          }

          .bakmen-intro-quote {
            font-size: clamp(25px, 8vw, 38px);
          }

          .bakmen-intro-author {
            margin-top: 26px;
          }
        }
      `}</style>
    </>
  );
}
