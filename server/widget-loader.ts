import { PLATFORM_COLORS } from "@shared/platformColors";

// Generate the universal widget loader script
export function generateUniversalWidgetScript(): string {
  const chatIcon = 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z';
  
  const platformIcons = {
    line: 'M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314',
    messenger: 'M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13',
    whatsapp: 'M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z',
    instagram: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z',
    phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
    email: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'
  };

  const platformColors = JSON.stringify(PLATFORM_COLORS);
  const platformIconsJson = JSON.stringify(platformIcons);

  return `
(function() {
  'use strict';
  
  var PLATFORM_COLORS = ${platformColors};
  var PLATFORM_ICONS = ${platformIconsJson};
  var CHAT_ICON = '${chatIcon}';

  var TRANSLATIONS = {
    'zh-TW': {
      mainButtonAria: '開啟聊天選單',
      platformTitles: {
        line: '透過 LINE 聯絡我們',
        messenger: '透過 Messenger 聯絡我們',
        whatsapp: '透過 WhatsApp 聯絡我們',
        instagram: '透過 Instagram 發送訊息',
        phone: '撥打電話給我們',
        email: '發送 Email 給我們',
        default: '聯絡客服'
      }
    },
    'ja': {
      mainButtonAria: 'チャットメニューを開く',
      platformTitles: {
        line: 'LINE で連絡する',
        messenger: 'Messenger で連絡する',
        whatsapp: 'WhatsApp でメッセージを送る',
        instagram: 'Instagram でメッセージを送る',
        phone: '電話をかける',
        email: 'メールを送る',
        default: 'お問い合わせ'
      }
    },
    'en': {
      mainButtonAria: 'Open chat menu',
      platformTitles: {
        line: 'Contact us on LINE',
        messenger: 'Contact us on Messenger',
        whatsapp: 'Message us on WhatsApp',
        instagram: 'Message us on Instagram',
        phone: 'Call us',
        email: 'Send us an email',
        default: 'Contact us'
      }
    }
  };

  function normalizeLanguage(lang) {
    if (lang === 'ja' || lang === 'en') {
      return lang;
    }
    return 'zh-TW';
  }

  function getTranslation(lang) {
    var normalized = normalizeLanguage(lang);
    return TRANSLATIONS[normalized] || TRANSLATIONS['zh-TW'];
  }
  
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var configId = currentScript.getAttribute('data-config-id');
  
  if (!configId) {
    console.error('ToldYou Button: data-config-id attribute is required');
    return;
  }
  
  // Derive API base URL from widget script src
  var scriptSrc = currentScript.src;
  var apiBase = scriptSrc ? scriptSrc.replace(/\\/widget\\.js.*$/, '') : '';
  
  if (!apiBase) {
    console.error('ToldYou Button: Unable to determine API base URL');
    return;
  }
  
  // Fetch configuration
  fetch(apiBase + '/api/configs/' + configId)
    .then(function(response) {
      if (!response.ok) throw new Error('Failed to load configuration');
      return response.json();
    })
    .then(function(data) {
      if (!data.success) throw new Error('Configuration not found');
      renderWidget(data.config, data.lang || 'zh-TW');
    })
    .catch(function(error) {
      console.error('ToldYou Button:', error);
    });
  
  function getBacklinkText(lang) {
    var texts = {
      'zh-TW': '報數據',
      'ja': 'レポートデータ',
      'en': 'Report Data'
    };
    return texts[lang] || texts['zh-TW'];
  }
  
  function sanitizeMessengerId(value) {
    if (!value) return '';
    var trimmed = value.trim();
    if (!trimmed) return '';

    try {
      var url = new URL(trimmed);
      var hostname = url.hostname.toLowerCase();
      var segments = url.pathname.split('/').filter(Boolean);

      if (hostname === 'm.me') {
        return segments[0] || '';
      }

      if (hostname.endsWith('facebook.com') || hostname.endsWith('messenger.com')) {
        var tIndex = segments.indexOf('t');
        if (tIndex !== -1 && segments[tIndex + 1]) {
          return segments[tIndex + 1];
        }
        if (segments.length) {
          return segments[segments.length - 1];
        }
      }
    } catch (e) {
      // ignore
    }

    return trimmed.replace(/^@/, '').split(/[/?#]/)[0];
  }

  function sanitizeInstagramHandle(value) {
    if (!value) return '';
    var trimmed = value.trim();
    if (!trimmed) return '';

    try {
      var url = new URL(trimmed);
      var hostname = url.hostname.toLowerCase();
      var segments = url.pathname.split('/').filter(Boolean);

      if (hostname === 'ig.me') {
        if (segments[0] === 'm') {
          return segments[1] || '';
        }
        return segments[0] || '';
      }

      if (hostname.endsWith('instagram.com')) {
        if (segments[0] && segments[0] !== 'direct') {
          return segments[0];
        }

        if (segments[0] === 'direct' && segments[1] === 't' && segments[2]) {
          return segments[2];
        }
      }
    } catch (e) {
      // ignore
    }

    return trimmed.replace(/^@/, '').split(/[/?#]/)[0];
  }

  function normalizePlatformValue(platform, value) {
    if (!value) return '';

    if (platform === 'messenger') {
      return sanitizeMessengerId(value);
    }

    if (platform === 'instagram') {
      return sanitizeInstagramHandle(value);
    }

    return value.trim();
  }

  function getPlatformUrl(platform, value) {
    if (!value) return '';
    var urls = {
      line: 'https://line.me/R/ti/p/' + encodeURIComponent(value),
      messenger: 'https://m.me/' + encodeURIComponent(value),
      whatsapp: 'https://wa.me/' + encodeURIComponent(value),
      instagram: 'https://ig.me/m/' + encodeURIComponent(value),
      phone: 'tel:' + value,
      email: 'mailto:' + value
    };
    return urls[platform];
  }
  
  function getPlatformLabel(platform) {
    var labels = {
      line: 'LINE',
      messenger: 'Messenger',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      phone: 'Phone',
      email: 'Email'
    };
    return labels[platform];
  }
  
  function renderWidget(config, lang) {
    var platforms = config.platforms;
    var position = config.position;
    var color = config.color;
    var normalizedLang = normalizeLanguage(lang);
    var translation = getTranslation(normalizedLang);
    var backlinkText = getBacklinkText(normalizedLang);
    var isExpanded = false;
    
    // Create button data
    var buttons = [];
    for (var platform in platforms) {
      if (!platforms.hasOwnProperty(platform)) continue;
      var normalizedValue = normalizePlatformValue(platform, platforms[platform]);
      if (!normalizedValue) continue;

      var url = getPlatformUrl(platform, normalizedValue);
      if (!url) continue;

      var buttonTitle = translation.platformTitles[platform] || translation.platformTitles.default;

      buttons.push({
        platform: platform,
        url: url,
        icon: PLATFORM_ICONS[platform],
        label: getPlatformLabel(platform),
        title: buttonTitle,
        color: PLATFORM_COLORS[platform]
      });
    }
    
    // Create main container
    var container = document.createElement('div');
    container.id = 'toldyou-button-widget';
    container.style.cssText = 'position:fixed;' + (position === 'bottom-left' ? 'left:24px;' : 'right:24px;') + 'bottom:24px;z-index:9999;display:flex;flex-direction:column;gap:12px;align-items:center;';
    
    // Create platform buttons container
    var platformContainer = document.createElement('div');
    platformContainer.style.cssText = 'display:flex;flex-direction:column;gap:12px;align-items:center;opacity:0;transform:translateY(8px) scale(0.95);transition:opacity 0.18s ease,transform 0.18s ease;pointer-events:none;';
    
    buttons.forEach(function(btn, index) {
      var button = document.createElement('a');
      button.href = btn.url;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      button.title = btn.title;
      button.setAttribute('aria-label', btn.title);
      button.style.cssText = 'display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background-color:' + btn.color + ';color:#fff;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.2s,box-shadow 0.2s;transition-delay:' + (index * 0.03) + 's;';
      
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'currentColor');
      
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', btn.icon);
      svg.appendChild(path);
      
      button.appendChild(svg);
      
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      });
      
      platformContainer.appendChild(button);
    });
    
    container.appendChild(platformContainer);
    
    // Create main FAB button
    var mainButton = document.createElement('button');
    mainButton.style.cssText = 'width:56px;height:56px;border-radius:50%;background-color:' + color + ';color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.2);transition:transform 0.2s,box-shadow 0.2s;';
    mainButton.setAttribute('aria-label', translation.mainButtonAria);
    mainButton.setAttribute('title', translation.mainButtonAria);
    mainButton.setAttribute('aria-expanded', 'false');
    
    var mainSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mainSvg.setAttribute('width', '28');
    mainSvg.setAttribute('height', '28');
    mainSvg.setAttribute('viewBox', '0 0 24 24');
    mainSvg.setAttribute('fill', 'currentColor');
    
    var mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mainPath.setAttribute('d', CHAT_ICON);
    mainSvg.appendChild(mainPath);
    
    mainButton.appendChild(mainSvg);
    
    // Toggle expand/collapse
    mainButton.addEventListener('click', function(e) {
      e.stopPropagation();
      isExpanded = !isExpanded;
      
      if (isExpanded) {
        platformContainer.style.opacity = '1';
        platformContainer.style.transform = 'translateY(0) scale(1)';
        platformContainer.style.pointerEvents = 'auto';
        mainButton.setAttribute('aria-expanded', 'true');
      } else {
        platformContainer.style.opacity = '0';
        platformContainer.style.transform = 'translateY(8px) scale(0.95)';
        platformContainer.style.pointerEvents = 'none';
        mainButton.setAttribute('aria-expanded', 'false');
      }
    });
    
    mainButton.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
    });
    
    mainButton.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
    });
    
    container.appendChild(mainButton);
    
    // Create backlink
    var backlink = document.createElement('a');
    backlink.href = 'https://thinkwithblack.com';
    backlink.target = '_blank';
    backlink.rel = 'noopener';
    backlink.textContent = backlinkText;
    backlink.style.cssText = 'font-size:11px;color:#9ca3af;text-decoration:none;transition:color 0.2s;';
    backlink.addEventListener('mouseenter', function() {
      this.style.color = '#6b7280';
    });
    backlink.addEventListener('mouseleave', function() {
      this.style.color = '#9ca3af';
    });
    
    container.appendChild(backlink);
    
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (isExpanded && !container.contains(e.target)) {
        isExpanded = false;
        platformContainer.style.opacity = '0';
        platformContainer.style.transform = 'translateY(8px) scale(0.95)';
        platformContainer.style.pointerEvents = 'none';
        mainButton.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isExpanded) {
        isExpanded = false;
        platformContainer.style.opacity = '0';
        platformContainer.style.transform = 'translateY(8px) scale(0.95)';
        platformContainer.style.pointerEvents = 'none';
        mainButton.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Add to page
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(container);
      });
    } else {
      document.body.appendChild(container);
    }
  }
})();
`.trim();
}
