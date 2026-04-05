import React, { useEffect } from 'react';
import Home from '../Pages/Home.jsx';// Halaman Home/Hero kamu
import Katalog from '../Pages/Katalog.jsx'; // Halaman Katalog kamu

const MainPage = () => {
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Update URL tanpa reload halaman
            window.history.pushState(null, "", `#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.5 } // Trigger saat 50% bagian terlihat
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-[#0f0f0f]">
      {/* Berikan ID sesuai nama link yang diinginkan */}
      <section id="home">
        <Home />
      </section>

    
      
      {/* Kamu bisa tambah section lain seperti Lookbook di sini */}
    </main>
  );
};

export default MainPage;