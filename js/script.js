/**
 * Diwali Celebration Interactive Scripts
 * Handles URL personalization, Panch Deepam lighting, themes, audio, and social sharing.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Preset message texts
  const messagePresets = {
    '1': "May millions of glowing lamps illuminate your life with infinite joy, good health, and radiant prosperity. Wishing you and your loved ones a sparkling Diwali!",
    '2': "Praying for Goddess Lakshmi and Lord Ganesha to shower your home with everlasting happiness, wealth, harmony, and peace this Diwali and always.",
    '3': "Wishing you a sparkling festival filled with dazzling fireworks, sweet moments, boxfuls of mithai, and memories to cherish forever. Shubh Deepavali!",
    '4': "May the sacred glow of diyas bring tranquility to your spirit, wisdom to your mind, and love to your home. Have a blessed and luminous Diwali!",
  };

  // DOM Elements
  const themeBtn = document.getElementById('theme-btn');
  const themeBtnLabel = document.getElementById('theme-btn-label');
  const soundBtn = document.getElementById('sound-btn');
  const soundBtnText = document.getElementById('sound-btn-text');
  const sparklerBtn = document.getElementById('sparkler-btn');
  const grandDiya = document.getElementById('grand-diya');
  
  const recipientNameEl = document.getElementById('recipient-name');
  const greetMessageEl = document.getElementById('greet-message');
  const senderNameEl = document.getElementById('sender-name');
  const greetSenderBox = document.getElementById('greet-sender-box');

  const diyaItems = document.querySelectorAll('.diya-item');
  const litCountText = document.getElementById('lit-count-text');
  const celebrationModal = document.getElementById('celebration-modal');
  const closeCelebrationBtn = document.getElementById('close-celebration-btn');
  const relightDiyasBtn = document.getElementById('relight-diyas-btn');
  const modalShareBtn = document.getElementById('modal-share-btn');

  const githubModal = document.getElementById('github-modal');
  const openGithubGuideBtn = document.getElementById('open-github-guide-btn');
  const closeGithubBtn = document.getElementById('close-github-btn');
  const dismissGithubModalBtn = document.getElementById('dismiss-github-modal-btn');

  const inputRecipient = document.getElementById('input-recipient');
  const inputSender = document.getElementById('input-sender');
  const inputPreset = document.getElementById('input-preset');
  const inputCustomMsg = document.getElementById('input-custom-msg');
  const customMessageGroup = document.getElementById('custom-message-group');
  const linkPreviewBox = document.getElementById('link-preview-box');
  const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
  const btnCopyLink = document.getElementById('btn-copy-link');
  const btnShareNative = document.getElementById('btn-share-native');

  const toastNotice = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');

  // Bell notes for 5 Diyas (Sa, Re, Ga, Pa, Dha in C)
  const diyaFrequencies = [523.25, 587.33, 659.25, 783.99, 880.00];

  // 1. Parse URL Parameters for Personalized Greeting
  function parseUrlGreetings() {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    const from = params.get('from');
    const msgId = params.get('msg');
    const customMsg = params.get('text');

    if (to) {
      recipientNameEl.textContent = `Warm Festive Greetings to ${decodeURIComponent(to)}!`;
      inputRecipient.value = decodeURIComponent(to);
    }

    if (from) {
      senderNameEl.textContent = decodeURIComponent(from);
      inputSender.value = decodeURIComponent(from);
      greetSenderBox.style.display = 'block';
    }

    if (customMsg) {
      greetMessageEl.textContent = decodeURIComponent(customMsg);
      inputPreset.value = 'custom';
      customMessageGroup.style.display = 'block';
      inputCustomMsg.value = decodeURIComponent(customMsg);
    } else if (msgId && messagePresets[msgId]) {
      greetMessageEl.textContent = messagePresets[msgId];
      inputPreset.value = msgId;
    }

    updateGeneratedLink();
  }

  // 2. Theme Switching Logic
  const themes = [
    { id: 'royal', label: 'Royal Gold' },
    { id: 'peacock', label: 'Peacock Jewel' },
    { id: 'crimson', label: 'Crimson Rani' },
    { id: 'golden', label: 'Golden Ambiance' }
  ];
  let currentThemeIndex = 0;

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const theme = themes[currentThemeIndex];
      document.body.setAttribute('data-theme', theme.id);
      themeBtnLabel.textContent = theme.label;
      showToast(`Theme changed to ${theme.label} 🎨`);

      if (window.festiveAudio) {
        window.festiveAudio.playBell(700, 0.8);
      }
    });
  }

  // 3. Audio / Drone Toggle
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      if (!window.festiveAudio) return;
      const isNowPlaying = window.festiveAudio.toggleSound();
      if (isNowPlaying) {
        soundBtn.classList.add('playing');
        soundBtnText.textContent = 'Music On';
        showToast('Festive classical ambient drone playing 🪕');
      } else {
        soundBtn.classList.remove('playing');
        soundBtnText.textContent = 'Music Off';
        showToast('Music muted 🔇');
      }
    });
  }

  // 4. Sparkler Mode Toggle
  if (sparklerBtn) {
    sparklerBtn.addEventListener('click', () => {
      if (!window.fireworksEngine) return;
      window.fireworksEngine.sparklerModeActive = !window.fireworksEngine.sparklerModeActive;
      
      if (window.fireworksEngine.sparklerModeActive) {
        sparklerBtn.classList.add('active');
        document.body.classList.add('sparkler-cursor-active');
        showToast('Sparkler Mode ON: Drag your pointer to create golden sparklers! ✨');
      } else {
        sparklerBtn.classList.remove('active');
        document.body.classList.remove('sparkler-cursor-active');
        showToast('Sparkler Mode OFF');
      }
    });
  }

  // 5. Grand Central Diya Tap
  if (grandDiya) {
    grandDiya.addEventListener('click', (e) => {
      const rect = grandDiya.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + 30;

      if (window.fireworksEngine) {
        window.fireworksEngine.createAnaarBurst(clickX, clickY);
      }
      if (window.festiveAudio) {
        window.festiveAudio.playBell(1046.50, 1.8); // High C Bell
      }
    });
  }

  // 6. Panch Deepam (5 Diyas Ritual)
  let litDiyas = 0;
  diyaItems.forEach((diya, index) => {
    diya.addEventListener('click', () => {
      if (diya.classList.contains('lit')) {
        // Already lit: burst small sparkle
        const rect = diya.getBoundingClientRect();
        if (window.fireworksEngine) {
          window.fireworksEngine.createDirectBurst(rect.left + rect.width / 2, rect.top + 20, null, 25);
        }
        return;
      }

      // Light this diya
      diya.classList.remove('unlit');
      diya.classList.add('lit');
      const pill = diya.querySelector('.diya-status-pill');
      if (pill) pill.textContent = 'Illuminated ✨';

      litDiyas++;
      litCountText.textContent = `${litDiyas} of 5 Diyas Lit`;

      // Sound chime
      if (window.festiveAudio) {
        const note = diyaFrequencies[index] || 600;
        window.festiveAudio.playBell(note, 2.0);
      }

      // Particle burst over diya
      const rect = diya.getBoundingClientRect();
      if (window.fireworksEngine) {
        window.fireworksEngine.createDirectBurst(rect.left + rect.width / 2, rect.top + 20, null, 40);
      }

      // Check if all 5 are lit
      if (litDiyas === 5) {
        setTimeout(() => {
          triggerGrandCelebration();
        }, 600);
      }
    });
  });

  function triggerGrandCelebration() {
    if (window.festiveAudio) {
      window.festiveAudio.playCelebration();
    }
    if (window.fireworksEngine) {
      window.fireworksEngine.grandFinale(5000);
    }
    setTimeout(() => {
      celebrationModal.classList.add('active');
    }, 1200);
  }

  if (closeCelebrationBtn) {
    closeCelebrationBtn.addEventListener('click', () => {
      celebrationModal.classList.remove('active');
    });
  }

  if (relightDiyasBtn) {
    relightDiyasBtn.addEventListener('click', () => {
      celebrationModal.classList.remove('active');
      litDiyas = 0;
      litCountText.textContent = `0 of 5 Diyas Lit`;
      diyaItems.forEach(diya => {
        diya.classList.remove('lit');
        diya.classList.add('unlit');
        const pill = diya.querySelector('.diya-status-pill');
        if (pill) pill.textContent = 'Tap to Light';
      });
      showToast('All Diyas reset! Tap them to light again ✨');
    });
  }

  if (modalShareBtn) {
    modalShareBtn.addEventListener('click', () => {
      celebrationModal.classList.remove('active');
      const genSection = document.getElementById('wish-generator');
      if (genSection) {
        genSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 7. Personalized Wish Generator Logic
  function getSelectedMessage() {
    const val = inputPreset.value;
    if (val === 'custom') {
      return inputCustomMsg.value.trim() || messagePresets['1'];
    }
    return messagePresets[val] || messagePresets['1'];
  }

  function getBaseUrl() {
    const url = new URL(window.location.href);
    url.search = '';
    return url.toString().replace(/\/$/, '') + '/';
  }

  function buildPersonalizedUrl() {
    const to = inputRecipient.value.trim();
    const from = inputSender.value.trim();
    const presetVal = inputPreset.value;

    const params = new URLSearchParams();
    if (to) params.set('to', to);
    if (from) params.set('from', from);

    if (presetVal === 'custom') {
      const customTxt = inputCustomMsg.value.trim();
      if (customTxt) params.set('text', customTxt);
    } else {
      params.set('msg', presetVal);
    }

    const query = params.toString();
    const base = getBaseUrl();
    return query ? `${base}?${query}` : base;
  }

  function updateGeneratedLink() {
    const fullUrl = buildPersonalizedUrl();
    if (linkPreviewBox) {
      linkPreviewBox.textContent = fullUrl;
    }
  }

  // Handle Preset Dropdown change
  if (inputPreset) {
    inputPreset.addEventListener('change', () => {
      if (inputPreset.value === 'custom') {
        customMessageGroup.style.display = 'block';
      } else {
        customMessageGroup.style.display = 'none';
      }
      updateGeneratedLink();
    });
  }

  [inputRecipient, inputSender, inputCustomMsg].forEach(input => {
    if (input) {
      input.addEventListener('input', updateGeneratedLink);
    }
  });

  // Share on WhatsApp
  if (btnShareWhatsapp) {
    btnShareWhatsapp.addEventListener('click', () => {
      const to = inputRecipient.value.trim();
      const from = inputSender.value.trim();
      const wishMsg = getSelectedMessage();
      const shareUrl = buildPersonalizedUrl();

      let text = `✨ *SHUBH DEEPAVALI* 🪔\n\n`;
      if (to) text += `Dear *${to}*,\n`;
      text += `${wishMsg}\n\n`;
      if (from) text += `With love & festive blessings,\n*${from}*\n\n`;
      text += `🌟 View your interactive Diwali card with fireworks & diyas here:\n${shareUrl}`;

      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      showToast('Opening WhatsApp to share your greeting! 💬');
    });
  }

  // Copy Shareable Link
  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', async () => {
      const url = buildPersonalizedUrl();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const ta = document.createElement('textarea');
          ta.value = url;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        showToast('Link copied to clipboard! Share it with friends & family 🔗');
      } catch (err) {
        showToast('Please copy the link from the preview box below!');
      }
    });
  }

  // Native Web Share API
  if (btnShareNative) {
    btnShareNative.addEventListener('click', async () => {
      const to = inputRecipient.value.trim();
      const shareUrl = buildPersonalizedUrl();
      const shareData = {
        title: '✨ Shubh Deepavali | Happy Diwali Wishes ✨',
        text: `Wishing ${to || 'you'} a sparkling, joyous, and luminous Diwali! 🪔✨`,
        url: shareUrl
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User dismissed or error
        }
      } else {
        // Fallback to copy
        btnCopyLink.click();
      }
    });
  }

  // 8. GitHub Hosting Guide Modal
  if (openGithubGuideBtn) {
    openGithubGuideBtn.addEventListener('click', () => {
      githubModal.classList.add('active');
    });
  }

  if (closeGithubBtn) {
    closeGithubBtn.addEventListener('click', () => {
      githubModal.classList.remove('active');
    });
  }

  if (dismissGithubModalBtn) {
    dismissGithubModalBtn.addEventListener('click', () => {
      githubModal.classList.remove('active');
    });
  }

  // Close modals when clicking backdrop or pressing Escape
  [celebrationModal, githubModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      celebrationModal.classList.remove('active');
      githubModal.classList.remove('active');
    }
  });

  // 9. Toast Notification Helper
  let toastTimer = null;
  function showToast(message) {
    if (!toastNotice) return;
    toastText.textContent = message;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  // Run initial parse
  parseUrlGreetings();
});
