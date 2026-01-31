// Supabase Configuration
const SUPABASE_URL = 'https://dfvnefbxgayxqgjjgtrr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WypeFELCIlVDlqGY4PdWwA_snqoPUSE';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

// Install Prompt
let deferredPrompt;
const installBtn = document.createElement('button');
installBtn.className = 'install-btn hidden';
installBtn.textContent = 'Install App';
document.body.appendChild(installBtn);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove('hidden');
  
  installBtn.addEventListener('click', () => {
    installBtn.classList.add('hidden');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install');
      } else {
        console.log('User dismissed install');
      }
      deferredPrompt = null;
    });
  });
});

// Common Functions
function generateID(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function resizeImage(file, maxSizeKB = 100) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions to maintain aspect ratio
        if (width > height) {
          if (width > 800) {
            height = Math.round(height * 800 / width);
            width = 800;
          }
        } else {
          if (height > 800) {
            width = Math.round(width * 800 / height);
            height = 800;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to meet max size
        let quality = 0.9;
        let dataUrl;
        
        do {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          quality -= 0.1;
        } while (dataUrl.length > maxSizeKB * 1024 && quality > 0.1);
        
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\+?[\d\s-()]+$/.test(phone);
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 10px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

export { supabase, generateID, resizeImage, validateEmail, validatePhone, showNotification };
