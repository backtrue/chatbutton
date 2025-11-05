import type { ButtonConfig } from "@shared/schema";
import { PLATFORM_COLORS } from "@shared/platformColors";
import { getBacklinkText, getBacklinkUrl } from "../client/src/lib/i18n";
import type { Language } from "../client/src/lib/i18n";

// Normalize color to Hex format
function normalizeColor(color: string): string {
  // Already Hex format
  if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color)) {
    if (color.length === 4) {
      // Expand #RGB to #RRGGBB
      const r = color[1];
      const g = color[2];
      const b = color[3];
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return color;
  }
  
  // RGB format: rgb(r, g, b)
  const rgbMatch = color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  return color; // Fallback
}

// Generate simplified embed code (new version)
export function generateSimplifiedEmbedCode(configId: string, baseUrl: string): string {
  return `<script src="${baseUrl}/widget.js" data-config-id="${configId}"></script>`;
}

// Generate widget JavaScript code (legacy - kept for backwards compatibility)
export function generateWidgetCode(config: ButtonConfig, lang: Language = 'zh-TW'): string {
  const { platforms, position, color } = config;
  const backlinkText = getBacklinkText(lang);
  const backlinkUrl = getBacklinkUrl();
  const mainButtonColor = normalizeColor(color);

  // Convert platforms to array of buttons with brand colors
  const buttons = [];
  
  if (platforms.line) {
    buttons.push({
      platform: 'line',
      url: `https://line.me/R/ti/p/${encodeURIComponent(platforms.line)}`,
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z',
      label: 'LINE',
      color: PLATFORM_COLORS.line,
    });
  }

  if (platforms.messenger) {
    buttons.push({
      platform: 'messenger',
      url: `https://m.me/${encodeURIComponent(platforms.messenger)}`,
      icon: 'M12 2C6.5 2 2 6.14 2 11.25c0 2.9 1.45 5.48 3.71 7.17V22l3.58-1.96c.95.26 1.96.41 3 .41 5.5 0 9.96-4.14 9.96-9.25S17.5 2 12.29 2H12z',
      label: 'Messenger',
      color: PLATFORM_COLORS.messenger,
    });
  }

  if (platforms.whatsapp) {
    buttons.push({
      platform: 'whatsapp',
      url: `https://wa.me/${encodeURIComponent(platforms.whatsapp)}`,
      icon: 'M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z',
      label: 'WhatsApp',
      color: PLATFORM_COLORS.whatsapp,
    });
  }

  if (platforms.instagram) {
    buttons.push({
      platform: 'instagram',
      url: `https://instagram.com/${encodeURIComponent(platforms.instagram)}`,
      icon: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z',
      label: 'Instagram',
      color: PLATFORM_COLORS.instagram,
    });
  }

  if (platforms.phone) {
    buttons.push({
      platform: 'phone',
      url: `tel:${platforms.phone}`,
      icon: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
      label: 'Phone',
      color: PLATFORM_COLORS.phone,
    });
  }

  if (platforms.email) {
    buttons.push({
      platform: 'email',
      url: `mailto:${platforms.email}`,
      icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
      label: 'Email',
      color: PLATFORM_COLORS.email,
    });
  }

  // Chat icon for main FAB button (message circle)
  const chatIcon = 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z';

  // Generate JavaScript code with collapsible widget
  const jsCode = `
(function() {
  'use strict';
  
  var config = ${JSON.stringify({ buttons, position, color: mainButtonColor, backlinkText, backlinkUrl })};
  var isExpanded = false;
  
  // Create main container
  var container = document.createElement('div');
  container.id = 'toldyou-button-widget';
  container.style.cssText = 'position:fixed;' + (config.position === 'bottom-left' ? 'left:24px;' : 'right:24px;') + 'bottom:24px;z-index:9999;display:flex;flex-direction:column;gap:12px;align-items:center;';
  
  // Create platform buttons container (will expand upward)
  var platformContainer = document.createElement('div');
  platformContainer.style.cssText = 'display:flex;flex-direction:column;gap:12px;align-items:center;opacity:0;transform:translateY(8px) scale(0.95);transition:opacity 0.18s ease,transform 0.18s ease;pointer-events:none;';
  
  config.buttons.forEach(function(btn, index) {
    var button = document.createElement('a');
    button.href = btn.url;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.title = btn.label;
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
  
  // Create main FAB button (user's custom color)
  var mainButton = document.createElement('button');
  mainButton.style.cssText = 'width:56px;height:56px;border-radius:50%;background-color:' + config.color + ';color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.2);transition:transform 0.2s,box-shadow 0.2s;';
  mainButton.setAttribute('aria-label', '開啟聊天選單');
  mainButton.setAttribute('aria-expanded', 'false');
  
  var mainSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  mainSvg.setAttribute('width', '28');
  mainSvg.setAttribute('height', '28');
  mainSvg.setAttribute('viewBox', '0 0 24 24');
  mainSvg.setAttribute('fill', 'currentColor');
  
  var mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  mainPath.setAttribute('d', '${chatIcon}');
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
  
  // Create backlink (SEO - CRITICAL: rel="noopener" ONLY, NO nofollow/sponsored)
  // This appears at the BOTTOM of the widget (last element in DOM)
  var backlink = document.createElement('a');
  backlink.href = config.backlinkUrl;
  backlink.target = '_blank';
  backlink.rel = 'noopener';
  backlink.textContent = config.backlinkText;
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
})();
  `.trim();

  return `<script>${jsCode}</script>`;
}
