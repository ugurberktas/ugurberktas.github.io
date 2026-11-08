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
      'nav-terminal':           'Terminal',
      'nav-terminal-action':    'Tam ekran terminali aç',
      'terminal-overlay-title': 'Tam ekran terminal',
      'terminal-overlay-close': '[ESC / Kapat]',
      'terminal-overlay-output':'Ben kimim...?',
      'hero-terminal-action':   'Tam ekran terminali aç',

      /* Hero */
      'hero-badge':             'Platform Intern @ GetirFinans',
      'hero-desc':              'Fırat Üniversitesi Yazılım Mühendisliği öğrencisi ve Junior DevOps Engineer adayıyım. GetirFinans, Intertech, DenizBank ve N11 gibi sektör liderlerinde edindiğim deneyimlerle fintech ekosisteminin altyapısını şekillendirmek için yolculuktayım.',
      'btn-projects':           'Projeleri Keşfet →',
      'btn-contact':            'Benimle İletişime Geç ↓',
      'social-cv-tr':           '📄 CV (TR)',
      'social-cv-en':           '📄 CV (EN)',
      'social-linkedin':        '💼 LinkedIn',
      'social-github':          '🐙 GitHub',
      'terminal-whoami-output': 'Ben kimim...?',
      'hero-scroll-cue':        'Daha Fazlasını Keşfet',

      /* Hero skills card */
      'skills-card-title':      'Öne Çıkan Uzmanlıklar',
      'skill-row-devops':       'DEVOPS & ALTYAPI',
      'skill-row-cloud':        'CLOUD & NETWORK',
      'skill-row-backend':      'BACKEND & DATA',

      /* About */
      'about-label':            'Hakkımda',
      'about-heading':          'Ben <span class="hl">Kimim?</span>',
      'about-p1':               '<strong>Fırat Üniversitesi Yazılım Mühendisliği</strong> öğrencisi ve Junior DevOps Engineer adayıyım. Kariyerimi; modern bulut mimarileri, CI/CD otomasyonu ve yüksek ölçekli sistem yönetimi üzerine inşa ediyorum.',
      'about-p2':               '<strong>GetirFinans</strong> bünyesinde Platform Intern olarak <strong>OpenShift, ArgoCD, Bitbucket, Jenkins ve JFrog</strong> altyapıları ile CI/CD süreçleri ve sistem izleme (Prometheus & Grafana) konuları üzerine çalışmaktayım. Daha önce <strong>Intertech</strong> ve <strong>DenizBank</strong> bünyesinde kritik altyapıların yönetimi, sistem izleme (Monitoring) ve veri güvenliği konularında pratik deneyim kazandım. <strong>N11</strong>\'de ise Postman ve Jenkins ile API test otomasyonu ve CI/CD pipeline entegrasyonu üzerine çalıştım.',
      'about-p3':               'Kendi <strong>Home-Lab</strong> ortamımda Docker Swarm, Kubernetes ve Cloudflare teknolojileriyle hibrit bulut senaryoları üzerinde çalışıyorum. Karmaşık altyapı problemlerini çözmekten keyif alan, sürekli öğrenen ve takım çalışmasının gücüne inanan bir mühendis olarak teknolojinin finansla buluştuğu noktada değer üretmek istiyorum.',
      'fact-key-university':    'Üniversite',
      'fact-key-location':      'Konum',
      'fact-key-role':          'Rol',
      'fact-key-focus':         'Odak',
      'fact-key-lab':           'Home Lab',
      'fact-key-language':      'Dil',
      'fact-val-university':    'Fırat Üniversitesi — Yazılım Mühendisliği',
      'fact-val-location':      'Türkiye',
      'fact-val-role':          'Platform Intern @ GetirFinans',
      'fact-val-focus':         'Cloud, CI/CD, Kubernetes, GitOps, Fintech Altyapısı',
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
      'getirfinans-date':       'Temmuz 2026 – Devam Ediyor',
      'getirfinans-role':       'Platform Intern (Tam Zamanlı)',
      'getirfinans-loc':        '📍 İstanbul',
      'getirfinans-li1':        'Kurumsal düzeydeki Kubernetes altyapısı olan OpenShift platformunda konteyner yönetimi ve orkestrasyon süreçlerinde aktif rol alıyorum.',
      'getirfinans-li2':        'Bitbucket depolarındaki güncellemelerin ArgoCD (GitOps) ve Jenkins (CI) ile otomatik olarak canlı ortamlara güvenle dağıtılmasını (CI/CD) sağlıyorum.',
      'getirfinans-li3':        'Derlenen uygulama ve imajları JFrog Artifactory üzerinde yönetiyor; Prometheus & Grafana ile OpenShift sisteminin sağlık durumunu ve CPU/RAM metriklerini anlık izliyorum.',
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
      'proj-desc-ustasanayicim':   'Oto sanayi işletmelerinin servis, iş emri, araç, müşteri, parça ve finans süreçlerini dijitalleştiren çok kiracılı SaaS platformu. Rol tabanlı paneller, güvenli API yetkilendirmesi ve PostgreSQL RLS politikalarıyla işletmeler arası veri izolasyonu sağlar.',
      'proj-desc-opsradar':         'JSONL uygulama loglarını yerel olarak işleyen, hassas verileri kayıt öncesinde maskeleyen ve kural tabanlı analizle ilişkili olayları incident\'lara dönüştüren SRE gözlemleme paneli. Olay korelasyonu, servis sağlığı takibi ve incident yönetimi sunar.',
      'proj-desc-orbit-scheduler': 'Uydu ve yer istasyonları arasındaki veri trafiğini otonom yöneten, çakışmaları önleyen ve görev önceliklendirmesine dayalı dinamik planlama mimarisi. IAC 2026 İnteraktif Sunum Kabulü.',
      'proj-desc-homelab':         'Proxmox üzerinde sanallaştırılmış Linux sunucuları ile kurulan, Cloudflare Tunnel ile güvenli hale getirilen ve Prometheus & Grafana ile anlık izlenen On-Prem laboratuvar ortamı.',
      'proj-desc-fraudcell':        'Finansal işlemleri gerçek bir scikit-learn modeliyle skorlayan ve yüksek riskli vakaları uzman analistlere yönlendiren dört servisli fraud inceleme MVP\'si. Vaka kararlarını transactional outbox ve RabbitMQ üzerinden işleyerek puan, rozet ve leaderboard akışını üretir.',
      'proj-desc-santiye-mobile':   'İnşaat işletmelerinin şantiye, personel, günlük çalışma, ödeme ve gider süreçlerini tek mobil platformda yöneten, iOS ve Android hedefli çok kiracılı SaaS uygulaması. Rol tabanlı erişim, PostgreSQL RLS ile işletme izolasyonu, başvuru yönetimi ve abonelik kontrol altyapısı sunar.',
      'proj-desc-reklagram':       'İlişkisel ve belge tabanlı veritabanlarının hibrit kullanıldığı Polyglot Persistence mimarisiyle AWS üzerinde çalışan yüksek ölçekli veri yönetim platformu.',
      'proj-desc-peak-games':      'Python tabanlı mikroservisin Dockerize edilmesi, Nginx ile Load Balancing sağlanması ve multi-stage build ile optimize edilmesi çalışması.',
      'proj-desc-speedgps':        'GPS verisini hibrit ölçüm yaklaşımıyla işleyerek anlık, ortalama ve maksimum hızı gösteren reklamsız PWA hız göstergesi. Sinyal dalgalanmalarını filtreler, bağlantı kesintilerinden sonra güvenli biçimde toparlanır ve mobil kullanımda ekranın açık kalmasını destekler.',
      'proj-link-live':            'Canlı',
      'proj-status-private-production': 'Private · Production',
      'proj-status-private-development': 'Private · Aktif Geliştirme',

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
      'nav-terminal':           'Terminal',
      'nav-terminal-action':    'Open fullscreen terminal',
      'terminal-overlay-title': 'Fullscreen terminal',
      'terminal-overlay-close': '[ESC / Close]',
      'terminal-overlay-output':'Who am I...?',
      'hero-terminal-action':   'Open fullscreen terminal',

      /* Hero */
      'hero-badge':             'Platform Intern @ GetirFinans',
      'hero-desc':              'Software Engineering student at Fırat University and Junior DevOps Engineer candidate. On a journey to shape the fintech infrastructure through hands-on experience at GetirFinans, Intertech, DenizBank and N11.',
      'btn-projects':           'Explore Projects →',
      'btn-contact':            'Get In Touch ↓',
      'social-cv-tr':           '📄 CV (TR)',
      'social-cv-en':           '📄 CV (EN)',
      'social-linkedin':        '💼 LinkedIn',
      'social-github':          '🐙 GitHub',
      'terminal-whoami-output': 'Who am I...?',
      'hero-scroll-cue':        'Discover More',

      /* Hero skills card */
      'skills-card-title':      'Featured Skills',
      'skill-row-devops':       'DEVOPS & INFRASTRUCTURE',
      'skill-row-cloud':        'CLOUD & NETWORK',
      'skill-row-backend':      'BACKEND & DATA',

      /* About */
      'about-label':            'About Me',
      'about-heading':          'Who <span class="hl">Am I?</span>',
      'about-p1':               '<strong>Software Engineering</strong> student at Fırat University and Junior DevOps Engineer candidate. I am building my career on modern cloud architectures, CI/CD automation and large-scale system management.',
      'about-p2':               'I am currently working as a Platform Intern at <strong>GetirFinans</strong>, focusing on <strong>OpenShift, ArgoCD, Bitbucket, Jenkins, and JFrog</strong> infrastructures, CI/CD pipelines, and system monitoring (Prometheus & Grafana). Previously, I gained hands-on experience in managing critical infrastructure, system monitoring and data security at <strong>Intertech</strong> and <strong>DenizBank</strong>. At <strong>N11</strong>, I worked on API test automation with Postman & Jenkins and CI/CD pipeline integration.',
      'about-p3':               'In my own <strong>Home-Lab</strong> environment I work on hybrid cloud scenarios using Docker Swarm, Kubernetes and Cloudflare. As an engineer who loves solving complex infrastructure problems, keeps learning and believes in the power of teamwork, I aim to create value where technology meets finance.',
      'fact-key-university':    'University',
      'fact-key-location':      'Location',
      'fact-key-role':          'Role',
      'fact-key-focus':         'Focus',
      'fact-key-lab':           'Home Lab',
      'fact-key-language':      'Language',
      'fact-val-university':    'Fırat University — Software Engineering',
      'fact-val-location':      'Turkey',
      'fact-val-role':          'Platform Intern @ GetirFinans',
      'fact-val-focus':         'Cloud, CI/CD, Kubernetes, GitOps, Fintech Infrastructure',
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
      'getirfinans-date':       'July 2026 – Present',
      'getirfinans-role':       'Platform Intern (Full-Time)',
      'getirfinans-loc':        '📍 Istanbul',
      'getirfinans-li1':        'Actively participating in container management and orchestration on OpenShift, the enterprise-grade Kubernetes platform.',
      'getirfinans-li2':        'Ensuring secure and automated deployment (CI/CD) of updates from Bitbucket repositories to production environments using ArgoCD (GitOps) and Jenkins (CI).',
      'getirfinans-li3':        'Managing built application and container images on JFrog Artifactory, and monitoring OpenShift system health, CPU/RAM metrics in real time with Prometheus & Grafana.',
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
      'proj-desc-ustasanayicim':   'A multi-tenant SaaS platform that digitalises service orders, vehicles, customers, parts and financial operations for automotive service businesses. It provides tenant-level data isolation through role-based dashboards, secure API authorisation and PostgreSQL RLS policies.',
      'proj-desc-opsradar':         'A local-first SRE observability dashboard that processes JSONL application logs, redacts sensitive values before persistence and correlates related events into incidents through deterministic rule-based analysis. It provides service health tracking and incident lifecycle management.',
      'proj-desc-orbit-scheduler': 'Autonomous data-traffic management architecture between satellites and ground stations that prevents collisions and enables dynamic mission-priority scheduling. Accepted for IAC 2026 Interactive Presentation.',
      'proj-desc-homelab':         'On-premises lab environment built with virtualised Linux servers on Proxmox, secured via Cloudflare Tunnel and monitored in real time with Prometheus & Grafana.',
      'proj-desc-fraudcell':        'A four-service fraud investigation MVP that scores financial transactions using a real scikit-learn model and assigns high-risk cases to specialised analysts. Case decisions are processed through a transactional outbox and RabbitMQ to generate points, badges and leaderboard data.',
      'proj-desc-santiye-mobile':   'A multi-tenant mobile SaaS application for managing construction sites, personnel, daily work, payments and expenses from a unified iOS and Android platform. It provides role-based access, tenant isolation through PostgreSQL RLS, business onboarding and subscription controls.',
      'proj-desc-reklagram':       'High-scale data-management platform running on AWS with a Polyglot Persistence architecture that combines relational and document-based databases.',
      'proj-desc-peak-games':      'Case study covering Dockerisation of a Python-based microservice, Load Balancing with Nginx and optimisation via multi-stage builds.',
      'proj-desc-speedgps':        'An ad-free PWA speedometer that processes GPS data through a hybrid measurement approach to display current, average and maximum speed. It filters signal fluctuations, recovers safely after connection loss and supports screen wake lock for mobile use.',
      'proj-link-live':            'Live',
      'proj-status-private-production': 'Private · Production',
      'proj-status-private-development': 'Private · Active Development',

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
