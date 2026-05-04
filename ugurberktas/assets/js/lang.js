(function () {
  'use strict';

  /* ── Translation maps ── */
  var TRANSLATIONS = {
    tr: {
      /* Navbar */
      'nav-home':               'Ana Sayfa',
      'nav-experience':         'Deneyim',
      'nav-projects':           'Projeler',
      'nav-certificates':       'Sertifikalar',
      'nav-education':          'Eğitim',
      'nav-contact':            'İletişim',

      /* Hero */
      'hero-badge':             'Junior DevOps Engineer',
      'hero-desc':              'Fırat Üniversitesi Yazılım Mühendisliği öğrencisi ve Junior DevOps Engineer adayıyım. Intertech, DenizBank ve N11 gibi sektör liderlerinde edindiğim deneyimlerle fintech ekosisteminin altyapısını şekillendirmek için yolculuktayım.',
      'btn-projects':           'Projeleri Keşfet →',
      'btn-contact':            'Benimle İletişime Geç ↓',
      'social-cv-tr':           '📄 CV (TR)',
      'social-cv-en':           '📄 CV (EN)',
      'social-linkedin':        '💼 LinkedIn',
      'social-github':          '🐙 GitHub',

      /* Hero skills card */
      'skills-card-title':      'Öne Çıkan Uzmanlıklar',
      'skill-row-devops':       'DEVOPS & ALTYAPI',
      'skill-row-cloud':        'CLOUD & NETWORK',
      'skill-row-backend':      'BACKEND & DATA',

      /* About */
      'about-label':            'Hakkımda',
      'about-heading':          'Ben <span class="hl">Kimim?</span>',
      'about-p1':               '<strong>Fırat Üniversitesi Yazılım Mühendisliği</strong> öğrencisi ve Junior DevOps Engineer adayıyım. Kariyerimi; modern bulut mimarileri, CI/CD otomasyonu ve yüksek ölçekli sistem yönetimi üzerine inşa ediyorum.',
      'about-p2':               '<strong>Intertech</strong> ve <strong>DenizBank</strong> bünyesinde kritik altyapıların yönetimi, sistem izleme (Monitoring) ve veri güvenliği konularında pratik deneyim kazandım. <strong>N11</strong>\'de Postman ve Jenkins ile API test otomasyonu ve CI/CD pipeline entegrasyonu üzerine çalıştım.',
      'about-p3':               'Kendi <strong>Home-Lab</strong> ortamımda Docker Swarm, Kubernetes ve Cloudflare teknolojileriyle hibrit bulut senaryoları üzerinde çalışıyorum. Karmaşık altyapı problemlerini çözmekten keyif alan, sürekli öğrenen ve takım çalışmasının gücüne inanan bir mühendis olarak teknolojinin finansla buluştuğu noktada değer üretmek istiyorum.',
      'fact-key-university':    'Üniversite',
      'fact-key-location':      'Konum',
      'fact-key-role':          'Rol',
      'fact-key-focus':         'Odak',
      'fact-key-lab':           'Home Lab',
      'fact-key-language':      'Dil',
      'fact-val-university':    'Fırat Üniversitesi — Yazılım Mühendisliği',
      'fact-val-location':      'Türkiye',
      'fact-val-role':          'Junior DevOps Engineer',
      'fact-val-focus':         'Cloud, CI/CD, Kubernetes, Fintech Altyapısı',
      'fact-val-lab':           'Docker Swarm · Kubernetes · Cloudflare',
      'fact-val-language':      'Türkçe (Anadil) · İngilizce (İş düzeyi)',

      /* Technical Skills */
      'skills-label':           'Uzmanlıklar',
      'skills-heading':         'Teknik <span class="hl">Yetenekler</span>',
      'skill-card-title-devops':'DevOps & Altyapı',
      'skill-card-title-cloud': 'Cloud & Monitoring',
      'skill-card-title-backend':'Backend & Scripting',

      /* Experience */
      'exp-label':              'İş Deneyimi',
      'section-experience':     'Deneyim',
      'intertech-date':         'Ağustos 2025 – Eylül 2025',
      'intertech-role':         'Sistem Mühendisi (Stajyer)',
      'intertech-li1':          'Kritik Core Banking ve High Availability (HA) sistemlerinin izlenmesi süreçlerinde aktif rol aldım.',
      'intertech-li2':          'Regülasyonlara uygun ortamda Linux sunucu optimizasyonu ve servis konfigürasyonlarını yönettim.',
      'intertech-li3':          'Bankacılık chatbot projesi kapsamında güvenli sistem mimarisi tasarımı ve API entegrasyonlarını gerçekleştirdim.',
      'n11-date':               'Temmuz 2025 – Ağustos 2025',
      'n11-role':               'Test Otomasyon Mühendisi (Stajyer)',
      'n11-li1':                'Postman ile API test senaryoları oluşturup Jenkins pipeline\'larına entegre ederek işlem güvenilirliğini garanti altına aldım.',
      'n11-li2':                'Otomasyon testlerini CI/CD hattına bağlayarak Pre-Prod ortamda kritik hataların erken tespitini sağladım.',
      'n11-li3':                'Agile metodolojisiyle sprint hedeflerine uygun yüksek kalitede yazılım teslimatına destek oldum.',
      'denizbank-date':         'Ağustos 2025',
      'denizbank-role':         'Veri Bilimi ve Yapay Zeka (Trainee)',
      'denizbank-li1':          'Finans sektörü için uçtan uca AI ve ML pipeline yönetimi üzerine yoğun eğitim aldım.',
      'denizbank-li2':          'Python (Pandas, Scikit-learn) kullanarak finansal veri analizi ve risk modelleme projeleri geliştirdim.',
      'elmar-date':             'Eylül 2024 – Ocak 2025',
      'elmar-role':             'Yazılım Geliştirici (Part-Time)',
      'elmar-li1':              'Şirket içi manuel süreçleri analiz ederek C# ile geliştirdiğim otomasyon araçlarıyla finansal iş akışlarında operasyonel yükü minimize ettim.',
      'elmar-li2':              'SQL veritabanında bakım prosedürleri yazarak Data Consistency ve sistem performansını optimize ettim.',

      /* Volunteering */
      'vol-label':              'Topluluk',
      'section-volunteering':   'Liderlik & Gönüllülük',
      'fueb-date':              '2024 – Devam Ediyor',
      'fueb-role':              'Genel Sekreter',
      'fueb-li1':               'Yönetim kurulu kararları doğrultusunda etkinlik planlaması ve ekip koordinasyonu sağladım.',
      'habitat-date':           '2025 – Devam Ediyor',
      'habitat-role':           'Gönüllü Eğitmen',
      'habitat-li1':            'Gençlere finansal okuryazarlık ve dijital eğitimler vererek toplumsal farkındalık sağladım.',
      'teknofest-date':         'Eylül 2025',
      'teknofest-role':         'Gönüllü (Görevli)',
      'teknofest-li1':          'Festival alanında saha operasyonları ve ziyaretçi koordinasyonunu destekledim.',

      /* Projects */
      'proj-label':             'Projeler',
      'section-projects':       'Projeler',
      'proj-desc-orbit-scheduler': 'Uydu ve yer istasyonları arasındaki veri trafiğini otonom yöneten, çakışmaları önleyen ve görev önceliklendirmesine dayalı dinamik planlama mimarisi. IAC 2026 İnteraktif Sunum Kabulü.',
      'proj-desc-orbital-sense':   'Uzay havası olaylarını anlık izleyen ve kritik altyapılar için NASA telemetri verileriyle potansiyel tehditleri öngören erken uyarı sistemi.',
      'proj-desc-optikoku':        'OpenCV ile mutlak koordinat analizi yaparak %0 hata payıyla optik form okuyan, anında Excel raporlaması sunan uçtan uca OMR sistemi.',
      'proj-desc-homelab':         'Proxmox üzerinde sanallaştırılmış Linux sunucuları ile kurulan, Cloudflare Tunnel ile güvenli hale getirilen ve Prometheus & Grafana ile anlık izlenen On-Prem laboratuvar ortamı.',
      'proj-desc-sks':             'Üniversite bünyesindeki tüm öğrenci topluluklarını tek dijital merkezde toplayan, .edu.tr mail doğrulamasıyla güvenli giriş sağlayan etkinlik ve üye yönetim platformu.',
      'proj-desc-hata-tespit':     'Üretim bandındaki ürünlerde oluşan fiziksel kusurları görüntü işleme algoritmaları ile erkenden tespit ederek fire oranını düşüren Computer Vision otomasyon projesi.',
      'proj-desc-odeme':           'Bankacılık standartlarına uygun, ACID prensiplerini koruyan, RabbitMQ ile asenkron çalışan mikroservis mimarisinde veri tutarlılığını garanti eden ödeme ağ geçidi simülasyonu.',
      'proj-desc-reklagram':       'İlişkisel ve belge tabanlı veritabanlarının hibrit kullanıldığı Polyglot Persistence mimarisiyle AWS üzerinde çalışan yüksek ölçekli veri yönetim platformu.',
      'proj-desc-docuchat':        'Kurumsal dokümanları dışarı sızdırmadan analiz eden, RAG (Retrieval-Augmented Generation) mimarisi üzerine kurulu güvenli yapay zeka asistanı.',
      'proj-desc-peak-games':      'Python tabanlı mikroservisin Dockerize edilmesi, Nginx ile Load Balancing sağlanması ve multi-stage build ile optimize edilmesi çalışması.',
      'proj-desc-elmar-muhasebe':  'Şirket içi finansal süreçleri hızlandıran, manuel iş yükünü minimize eden ve SQL tabanlı dinamik raporlama yapan masaüstü otomasyon yazılımı.',
      'proj-desc-railguard':       'Demiryolu makas sensörlerinden gelen SCADA verilerini anlık işleyerek YHT hatlarındaki aşınma ve arıza risklerini önceden tespit eden simülasyon ve merkezi izleme paneli. Ulaştırma Bakanlığı fikir yarışması projesi.',

      /* Certificates */
      'cert-label':             'Başarılar',
      'section-certificates':   'Sertifikalar & <span class="hl">Başarılar</span>',
      'show-more-btn':          'Daha Fazla Göster',
      'show-less-btn':          'Daha Az Göster',

      /* Education */
      'edu-label':              'Eğitim',
      'section-education':      'Eğitim<span class="hl"> Hayatım</span>',
      'edu-firat-degree':       'Lisans — Yazılım Mühendisliği',
      'edu-firat-years':        '2024 — Devam Ediyor',
      'active-student':         'Aktif Öğrenci',
      'edu-gumushane-degree':   'Yazılım Mühendisliği — Yatay Geçiş',
      'lateral-transfer':       'Yatay Geçiş',

      /* Contact & Footer */
      'contact-label':          'İletişim',
      'section-contact':        'İletişim<span class="hl"> & Bağlantı</span>',
      'contact-headline':       'Hadi Birlikte Harika Şeyler Yapalım',
      'contact-subtext':        'DevOps, Cloud veya sistem altyapısı projelerinizde işbirliği için benimle iletişime geçin.',
      'footer-copy':            '\u00a9 2025 Uğur Berktaş. Tüm hakları saklıdır.'
    },

    en: {
      /* Navbar */
      'nav-home':               'Home',
      'nav-experience':         'Experience',
      'nav-projects':           'Projects',
      'nav-certificates':       'Certificates',
      'nav-education':          'Education',
      'nav-contact':            'Contact',

      /* Hero */
      'hero-badge':             'Junior DevOps Engineer',
      'hero-desc':              'Software Engineering student at Fırat University and Junior DevOps Engineer candidate. On a journey to shape the fintech infrastructure through hands-on experience at Intertech, DenizBank and N11.',
      'btn-projects':           'Explore Projects →',
      'btn-contact':            'Get In Touch ↓',
      'social-cv-tr':           '📄 CV (TR)',
      'social-cv-en':           '📄 CV (EN)',
      'social-linkedin':        '💼 LinkedIn',
      'social-github':          '🐙 GitHub',

      /* Hero skills card */
      'skills-card-title':      'Featured Skills',
      'skill-row-devops':       'DEVOPS & INFRASTRUCTURE',
      'skill-row-cloud':        'CLOUD & NETWORK',
      'skill-row-backend':      'BACKEND & DATA',

      /* About */
      'about-label':            'About Me',
      'about-heading':          'Who <span class="hl">Am I?</span>',
      'about-p1':               '<strong>Software Engineering</strong> student at Fırat University and Junior DevOps Engineer candidate. I am building my career on modern cloud architectures, CI/CD automation and large-scale system management.',
      'about-p2':               'At <strong>Intertech</strong> and <strong>DenizBank</strong> I gained hands-on experience in managing critical infrastructure, system monitoring and data security. At <strong>N11</strong> I worked on API test automation with Postman & Jenkins and CI/CD pipeline integration.',
      'about-p3':               'In my own <strong>Home-Lab</strong> environment I work on hybrid cloud scenarios using Docker Swarm, Kubernetes and Cloudflare. As an engineer who loves solving complex infrastructure problems, keeps learning and believes in the power of teamwork, I aim to create value where technology meets finance.',
      'fact-key-university':    'University',
      'fact-key-location':      'Location',
      'fact-key-role':          'Role',
      'fact-key-focus':         'Focus',
      'fact-key-lab':           'Home Lab',
      'fact-key-language':      'Language',
      'fact-val-university':    'Fırat University — Software Engineering',
      'fact-val-location':      'Turkey',
      'fact-val-role':          'Junior DevOps Engineer',
      'fact-val-focus':         'Cloud, CI/CD, Kubernetes, Fintech Infrastructure',
      'fact-val-lab':           'Docker Swarm · Kubernetes · Cloudflare',
      'fact-val-language':      'Turkish (Native) · English (Professional)',

      /* Technical Skills */
      'skills-label':           'Expertise',
      'skills-heading':         'Technical <span class="hl">Skills</span>',
      'skill-card-title-devops':'DevOps & Infrastructure',
      'skill-card-title-cloud': 'Cloud & Monitoring',
      'skill-card-title-backend':'Backend & Scripting',

      /* Experience */
      'exp-label':              'Work Experience',
      'section-experience':     'Experience',
      'intertech-date':         'August 2025 – September 2025',
      'intertech-role':         'System Engineer (Intern)',
      'intertech-li1':          'Actively monitored critical Core Banking and High Availability (HA) systems.',
      'intertech-li2':          'Managed Linux server optimization and service configurations in a regulation-compliant environment.',
      'intertech-li3':          'Designed secure system architecture and performed API integrations for a banking chatbot project.',
      'n11-date':               'July 2025 – August 2025',
      'n11-role':               'Test Automation Engineer (Intern)',
      'n11-li1':                'Created API test scenarios with Postman and integrated them into Jenkins pipelines to guarantee transaction reliability.',
      'n11-li2':                'Connected automation tests to the CI/CD pipeline to enable early detection of critical bugs in Pre-Prod.',
      'n11-li3':                'Supported high-quality software delivery aligned with sprint goals using Agile methodology.',
      'denizbank-date':         'August 2025',
      'denizbank-role':         'Data Science & AI (Trainee)',
      'denizbank-li1':          'Received intensive training on end-to-end AI and ML pipeline management for the finance sector.',
      'denizbank-li2':          'Developed financial data analysis and risk modelling projects using Python (Pandas, Scikit-learn).',
      'elmar-date':             'September 2024 – January 2025',
      'elmar-role':             'Software Developer (Part-Time)',
      'elmar-li1':              'Analysed internal manual processes and minimised operational load in financial workflows by developing automation tools in C#.',
      'elmar-li2':              'Wrote database maintenance procedures in SQL to optimise Data Consistency and system performance.',

      /* Volunteering */
      'vol-label':              'Community',
      'section-volunteering':   'Leadership & Volunteering',
      'fueb-date':              '2024 – Present',
      'fueb-role':              'General Secretary',
      'fueb-li1':               'Coordinated event planning and team activities in line with board decisions.',
      'habitat-date':           '2025 – Present',
      'habitat-role':           'Volunteer Trainer',
      'habitat-li1':            'Raised community awareness by delivering financial literacy and digital education sessions to youth.',
      'teknofest-date':         'September 2025',
      'teknofest-role':         'Volunteer Staff',
      'teknofest-li1':          'Supported field operations and visitor coordination at the festival grounds.',

      /* Projects */
      'proj-label':             'Projects',
      'section-projects':       'Projects',
      'proj-desc-orbit-scheduler': 'Autonomous data-traffic management architecture between satellites and ground stations that prevents collisions and enables dynamic mission-priority scheduling. Accepted for IAC 2026 Interactive Presentation.',
      'proj-desc-orbital-sense':   'Real-time space-weather monitoring system that uses NASA telemetry data to anticipate potential threats to critical infrastructure.',
      'proj-desc-optikoku':        'End-to-end OMR system that reads optical forms with 0% error margin using absolute-coordinate analysis with OpenCV and delivers instant Excel reports.',
      'proj-desc-homelab':         'On-premises lab environment built with virtualised Linux servers on Proxmox, secured via Cloudflare Tunnel and monitored in real time with Prometheus & Grafana.',
      'proj-desc-sks':             'Event and membership management platform that consolidates all university student communities in a single digital hub with secure .edu.tr e-mail authentication.',
      'proj-desc-hata-tespit':     'Computer Vision automation project that detects physical defects on production-line products early using image-processing algorithms, reducing the scrap rate.',
      'proj-desc-odeme':           'Payment gateway simulation built on a microservice architecture that complies with banking standards, preserves ACID principles and uses RabbitMQ for asynchronous processing.',
      'proj-desc-reklagram':       'High-scale data-management platform running on AWS with a Polyglot Persistence architecture that combines relational and document-based databases.',
      'proj-desc-docuchat':        'Secure AI assistant built on RAG (Retrieval-Augmented Generation) architecture that analyses corporate documents without leaking them externally.',
      'proj-desc-peak-games':      'Case study covering Dockerisation of a Python-based microservice, Load Balancing with Nginx and optimisation via multi-stage builds.',
      'proj-desc-elmar-muhasebe':  'Desktop automation software that speeds up internal financial processes, minimises manual workload and generates dynamic SQL-based reports.',
      'proj-desc-railguard':       'Simulation and centralised monitoring dashboard that processes real-time SCADA data from railway switch sensors to predict wear and failure risks on high-speed rail lines. Ministry of Transport idea competition project.',

      /* Certificates */
      'cert-label':             'Achievements',
      'section-certificates':   'Certificates & <span class="hl">Achievements</span>',
      'show-more-btn':          'Show More',
      'show-less-btn':          'Show Less',

      /* Education */
      'edu-label':              'Education',
      'section-education':      'Education<span class="hl"> History</span>',
      'edu-firat-degree':       'Bachelor\'s — Software Engineering',
      'edu-firat-years':        '2024 — Present',
      'active-student':         'Active Student',
      'edu-gumushane-degree':   'Software Engineering — Lateral Transfer',
      'lateral-transfer':       'Lateral Transfer',

      /* Contact & Footer */
      'contact-label':          'Contact',
      'section-contact':        'Contact<span class="hl"> & Connect</span>',
      'contact-headline':       'Let\'s Build Great Things Together',
      'contact-subtext':        'Feel free to reach out for DevOps, Cloud or infrastructure collaboration.',
      'footer-copy':            '\u00a9 2025 Uğur Berktaş. All rights reserved.'
    }
  };

  /* ── State ── */
  var currentLang = localStorage.getItem('ub-lang') || 'tr';

  /* ── Apply translations ── */
  function applyLang(lang) {
    var map = TRANSLATIONS[lang];
    if (!map) return;

    document.querySelectorAll('[data-lang-key]').forEach(function (el) {
      var key = el.getAttribute('data-lang-key');
      if (map[key] === undefined) return;

      var val = map[key];

      /* Elements that allow inner HTML (headings, spans with nested tags, paragraphs with <strong>) */
      var allowHtml = el.tagName === 'H2'
        || el.classList.contains('section-heading')
        || el.classList.contains('about-paragraph')
        || el.classList.contains('section-label')
        || el.classList.contains('contact-headline')
        || el.classList.contains('contact-subtext');

      if (allowHtml) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    /* Update lang button labels */
    document.querySelectorAll('.nav-lang-btn').forEach(function (btn) {
      btn.textContent = lang === 'tr' ? 'EN' : 'TR';
      btn.setAttribute('aria-label', lang === 'tr' ? 'Switch to English' : 'Dili Türkçeye geç');
    });

    /* Update html lang attribute */
    document.documentElement.setAttribute('lang', lang === 'tr' ? 'tr' : 'en');

    currentLang = lang;
    localStorage.setItem('ub-lang', lang);

    /* Notify other modules (e.g. certificates.js) about the lang change */
    document.dispatchEvent(new CustomEvent('ub:langchange', { detail: { lang: lang } }));
  }

  /* ── Toggle handler ── */
  function toggleLang() {
    applyLang(currentLang === 'tr' ? 'en' : 'tr');
  }

  /* ── Bind all lang buttons (desktop + mobile) ── */
  function init() {
    document.querySelectorAll('.nav-lang-btn').forEach(function (btn) {
      btn.addEventListener('click', toggleLang);
    });
    applyLang(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
