# CLAUDE.md

Bu dosya, bu repoda çalışan Claude Code (veya başka bir AI asistanı) için rehberdir.

## Proje Nedir

**Inviteasily** ürününün tek sayfalık (single-page) **tanıtım / landing sitesi**. Ürünün kendisi değil, ürünü anlatıp demo talebi toplayan pazarlama sitesidir.

Ürün: Düğün ve davet salonları için **WhatsApp tabanlı, yapay zekâ destekli davet & katılım (RSVP) yönetim paneli**. Davetliler WhatsApp'tan serbest Türkçe ile yanıt verir; yapay zekâ mesajı yorumlayıp katılım durumunu, kişi sayısını ve ek davetlileri otomatik çıkarır. Hedef kitle: düğün/davet salonları, organizasyon firmaları, oteller. Site dili **Türkçe**, hedef pazar Türkiye.

## Teknoloji & Mimari

- **Saf statik site** — build adımı, paket yöneticisi, framework yok. Düz HTML + CSS + vanilla JS.
- Sadece üç ana dosya:
  - `index.html` — tüm sayfa içeriği (tek sayfa, bölüm bölüm). Bölümler: Header → Hero → Trust strip → Problem → Nasıl Çalışır → AI Spotlight → Özellikler → Showcase (panel ekran görüntüleri) → Neden → Kimler için → SSS → CTA/Form → Footer.
  - `styles.css` — tüm stiller. `:root` içinde CSS değişkenleriyle tanımlı tasarım sistemi.
  - `script.js` — tüm etkileşimler. Tek bir IIFE içinde, kütüphane yok (Supabase JS hariç).
- **Supabase** — yalnızca demo formu için. `script.js` içinde CDN'den (`@supabase/supabase-js@2`) yüklenir; form gönderimi `demo_requests` tablosuna `insert` eder. URL ve anon key `script.js` başında sabit (anon key public olması normaldir).
- **Yazı tipleri**: Playfair Display (serif başlıklar) + Inter (gövde), Google Fonts'tan.
- `assets/logo/` — marka logoları (navy/cream, svg+png). `assets/screens/` — panelin ekran görüntüleri (1–12.png), Showcase sekmelerinde ve lightbox'ta kullanılır.

## Geliştirme

- **Çalıştırma**: build yok. Dosyayı tarayıcıda açmak yeterli; ya da basit bir statik sunucu (ör. `python3 -m http.server`).
- **Deploy**: statik hosting (dosyaları olduğu gibi servis et).

## Tasarım Sistemi (styles.css `:root`)

- Renkler: Lacivert (`--navy-900` #0F172A) + Altın (`--gold-500` #C9A24D) + İvori (`--ivory` #F6F1E9).
- Durum renkleri (green/red/amber/gray) `--*-ink/-bg/-bd` üçlüsüyle tanımlı.
- Type, radius, shadow, layout (`--container: 1200px`) değişkenleri mevcut.
- Yeni stil eklerken **mutlaka bu değişkenleri kullan**, sabit hex/px gömme.

## Kod Konvansiyonları

- JS: ES5 söz dizimi (`var`, fonksiyon ifadeleri), tek IIFE, `'use strict'`. Mevcut stile uy — modern modül/`const` getirme.
- Tüm DOM ikonları **inline SVG** olarak gömülü; ikon kütüphanesi yok.
- **Erişilebilirlik & motion**: `prefers-reduced-motion` her animasyon için kontrol ediliyor (statik fallback render edilir). Yeni animasyon eklersen aynı deseni izle. `aria-*` etiketleri ve `role` değerleri korunmalı.
- Animasyonlar genelde `IntersectionObserver` ile görünür olunca tetiklenir ve `.in` / `.show` sınıflarıyla yürür.

## Önemli Davranışlar

- **Hero**: sahte WhatsApp konuşması döngüsel animasyonla oynar (`waScript`).
- **AI Spotlight**: ekrana girince örnek mesajlar + "AI sonucu" çipleri animasyonla gösterilir (`aiScript`).
- **Showcase**: sekmeli ekran görüntüsü galerisi; otomatik geçiş (6sn), hover'da durur, tıklamayla lightbox açılır (ok tuşları + Esc destekli).
- **Demo formu**: client-side doğrulama → Supabase insert. Supabase yüklenemezse yine başarı ekranı gösterilir (form bozulmaz).

## Notlar

- İçerik tamamen Türkçe; metin değişikliklerinde Türkçe dili ve marka tonunu (sade, güven veren) koru.
- Slogan: "Events, managed easily." İletişim: info@inviteasily.com.
