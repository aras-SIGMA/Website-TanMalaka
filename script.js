/* ==========================================================================
   Tan Malaka — Arsip Perjuangan
   Animasi & interaksi dengan JavaScript native (tanpa library)
   ========================================================================== */

(function () {
    "use strict";

    var kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ----------------------------------------------------------------------
       1. Progress bar baca + header saat di-scroll
       ---------------------------------------------------------------------- */
    var progressBar = document.getElementById("scrollProgress");
    var header = document.getElementById("siteHeader");
    var tombolAtas = document.getElementById("toTop");

    function hitungProgres() {
        var tinggiHalaman = document.documentElement.scrollHeight - window.innerHeight;
        var posisi = window.scrollY;

        if (progressBar) {
            var persen = tinggiHalaman > 0 ? (posisi / tinggiHalaman) * 100 : 0;
            progressBar.style.width = persen.toFixed(2) + "%";
        }

        if (header) {
            header.classList.toggle("is-scrolled", posisi > 12);
        }

        if (tombolAtas) {
            tombolAtas.classList.toggle("is-visible", posisi > 420);
        }
    }

    var ticking = false;

    function saatScroll() {
        if (ticking) {
            return;
        }
        ticking = true;
        window.requestAnimationFrame(function () {
            hitungProgres();
            ticking = false;
        });
    }

    window.addEventListener("scroll", saatScroll, { passive: true });
    window.addEventListener("resize", hitungProgres);
    hitungProgres();

    /* ----------------------------------------------------------------------
       2. Tombol kembali ke atas
       ---------------------------------------------------------------------- */
    if (tombolAtas) {
        tombolAtas.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: kurangiGerak ? "auto" : "smooth" });
        });
    }

    /* ----------------------------------------------------------------------
       3. Menu navigasi mobile
       ---------------------------------------------------------------------- */
    var navToggle = document.getElementById("navToggle");
    var navUtama = document.getElementById("navUtama");

    function tutupMenu() {
        if (!navToggle || !navUtama) {
            return;
        }
        navToggle.classList.remove("is-open");
        navUtama.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    }

    if (navToggle && navUtama) {
        navToggle.addEventListener("click", function () {
            var terbuka = navToggle.classList.toggle("is-open");
            navUtama.classList.toggle("is-open", terbuka);
            navToggle.setAttribute("aria-expanded", terbuka ? "true" : "false");
        });

        navUtama.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                tutupMenu();
            }
        });

        document.addEventListener("click", function (event) {
            if (!navUtama.classList.contains("is-open")) {
                return;
            }
            if (!navUtama.contains(event.target) && !navToggle.contains(event.target)) {
                tutupMenu();
            }
        });
    }

    /* ----------------------------------------------------------------------
       4. Sorot tautan navigasi sesuai bagian yang sedang dilihat
       ---------------------------------------------------------------------- */
    var tautanNav = Array.prototype.slice.call(document.querySelectorAll(".site-nav__link"));
    var bagian = tautanNav
        .map(function (tautan) {
            var id = tautan.getAttribute("href");
            return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
        })
        .filter(Boolean);

    function tandaiAktif(id) {
        tautanNav.forEach(function (tautan) {
            tautan.classList.toggle("is-active", tautan.getAttribute("href") === "#" + id);
        });
    }

    if ("IntersectionObserver" in window && bagian.length) {
        var pengamatBagian = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        tandaiAktif(entry.target.id);
                    }
                });
            },
            { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
        );

        bagian.forEach(function (elemen) {
            pengamatBagian.observe(elemen);
        });
    }

    /* ----------------------------------------------------------------------
       5. Animasi muncul saat elemen masuk layar
       ---------------------------------------------------------------------- */
    var elemenReveal = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

    if (kurangiGerak || !("IntersectionObserver" in window)) {
        elemenReveal.forEach(function (el) {
            el.classList.add("is-visible");
        });
    } else {
        var pengamatReveal = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry, index) {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    // jeda kecil berurutan agar tidak muncul serentak
                    entry.target.style.transitionDelay = index * 90 + "ms";
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
        );

        elemenReveal.forEach(function (el) {
            pengamatReveal.observe(el);
        });
    }

    /* ----------------------------------------------------------------------
       6. Efek mengetik pada subjudul hero
       ---------------------------------------------------------------------- */
    var subjudul = document.getElementById("heroSubtitle");

    if (subjudul && subjudul.dataset.text) {
        if (kurangiGerak) {
            subjudul.textContent = subjudul.dataset.text;
            subjudul.classList.add("is-done");
        } else {
            var teksTarget = subjudul.dataset.text;
            var indeks = 0;
            var arahMundur = false;

            var ketik = function () {
                if (!arahMundur) {
                    indeks++;
                    subjudul.textContent = teksTarget.slice(0, indeks);

                    if (indeks === teksTarget.length) {
                        arahMundur = true;
                        subjudul.classList.add("is-done");
                        window.setTimeout(ketik, 2600);
                        return;
                    }
                    window.setTimeout(ketik, 55);
                } else {
                    subjudul.classList.remove("is-done");
                    indeks--;
                    subjudul.textContent = teksTarget.slice(0, indeks);

                    if (indeks === 0) {
                        arahMundur = false;
                        window.setTimeout(ketik, 700);
                        return;
                    }
                    window.setTimeout(ketik, 25);
                }
            };

            window.setTimeout(ketik, 700);
        }
    }

    /* ----------------------------------------------------------------------
       7. Animasi angka statistik
       ---------------------------------------------------------------------- */
    var angkaStat = Array.prototype.slice.call(document.querySelectorAll(".stats__value"));

    function jalankanAngka(el) {
        var target = parseInt(el.dataset.count, 10) || 0;
        var durasi = 1400;
        var mulai = null;

        if (kurangiGerak) {
            el.textContent = String(target);
            return;
        }

        function langkah(waktu) {
            if (mulai === null) {
                mulai = waktu;
            }
            var progres = Math.min((waktu - mulai) / durasi, 1);
            // easeOutCubic
            var halus = 1 - Math.pow(1 - progres, 3);
            el.textContent = String(Math.round(target * halus));

            if (progres < 1) {
                window.requestAnimationFrame(langkah);
            }
        }

        window.requestAnimationFrame(langkah);
    }

    if ("IntersectionObserver" in window && angkaStat.length) {
        var pengamatAngka = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        jalankanAngka(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );

        angkaStat.forEach(function (el) {
            pengamatAngka.observe(el);
        });
    } else {
        angkaStat.forEach(jalankanAngka);
    }

    /* ----------------------------------------------------------------------
       8. Lightbox galeri buku
       ---------------------------------------------------------------------- */
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightboxImg");
    var lightboxCaption = document.getElementById("lightboxCaption");
    var tombolTutup = document.getElementById("lightboxClose");
    var tombolSebelum = document.getElementById("lightboxPrev");
    var tombolBerikut = document.getElementById("lightboxNext");

    var daftarGambar = Array.prototype.slice.call(document.querySelectorAll(".gallery__item img"));
    var indeksAktif = 0;
    var elemenFokusTerakhir = null;

    function tampilkanGambar(indeks) {
        if (!daftarGambar.length) {
            return;
        }
        indeksAktif = (indeks + daftarGambar.length) % daftarGambar.length;

        var gambar = daftarGambar[indeksAktif];
        var figure = gambar.closest("figure");
        var caption = figure ? figure.querySelector("figcaption") : null;

        // restart animasi zoom tiap kali gambar berganti
        lightboxImg.style.animation = "none";
        void lightboxImg.offsetWidth;
        lightboxImg.style.animation = "";

        lightboxImg.src = gambar.currentSrc || gambar.src;
        lightboxImg.alt = gambar.alt || "";
        lightboxCaption.textContent = caption ? caption.textContent : gambar.alt;
    }

    function bukaLightbox(indeks) {
        if (!lightbox) {
            return;
        }
        elemenFokusTerakhir = document.activeElement;
        lightbox.hidden = false;
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
        tampilkanGambar(indeks);
        if (tombolTutup) {
            tombolTutup.focus();
        }
    }

    function tutupLightbox() {
        if (!lightbox || lightbox.hidden) {
            return;
        }
        lightbox.classList.remove("is-open");
        document.body.style.overflow = "";

        window.setTimeout(function () {
            lightbox.hidden = true;
            lightboxImg.src = "";
        }, kurangiGerak ? 0 : 300);

        if (elemenFokusTerakhir) {
            elemenFokusTerakhir.focus();
        }
    }

    daftarGambar.forEach(function (gambar, indeks) {
        gambar.parentElement.style.cursor = "zoom-in";
        gambar.parentElement.addEventListener("click", function () {
            bukaLightbox(indeks);
        });
    });

    if (tombolTutup) {
        tombolTutup.addEventListener("click", tutupLightbox);
    }

    if (tombolSebelum) {
        tombolSebelum.addEventListener("click", function () {
            tampilkanGambar(indeksAktif - 1);
        });
    }

    if (tombolBerikut) {
        tombolBerikut.addEventListener("click", function () {
            tampilkanGambar(indeksAktif + 1);
        });
    }

    if (lightbox) {
        // klik area gelap menutup lightbox
        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                tutupLightbox();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            tutupMenu();
            tutupLightbox();
            return;
        }

        if (!lightbox || lightbox.hidden) {
            return;
        }

        if (event.key === "ArrowLeft") {
            tampilkanGambar(indeksAktif - 1);
        } else if (event.key === "ArrowRight") {
            tampilkanGambar(indeksAktif + 1);
        }
    });

    /* ----------------------------------------------------------------------
       9. Efek parallax halus pada judul hero saat digulir
       ---------------------------------------------------------------------- */
    var heroContent = document.querySelector(".hero__content");

    if (heroContent && !kurangiGerak) {
        window.addEventListener(
            "scroll",
            function () {
                var posisi = window.scrollY;
                if (posisi > window.innerHeight) {
                    return;
                }
                heroContent.style.transform = "translateY(" + posisi * 0.08 + "px)";
                heroContent.style.opacity = String(Math.max(1 - posisi / (window.innerHeight * 0.9), 0));
            },
            { passive: true }
        );
    }
})();
