import { supabase, resizeImage, validateEmail, validatePhone, showNotification } from './app.js';

// Get card ID from URL
const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('id');

// DOM Elements
const profileImageInput = document.getElementById('profileImage');
const imagePreview = document.getElementById('imagePreview');
const fullNameInput = document.getElementById('fullName');
const phoneInput = document.getElementById('phone');
const whatsappInput = document.getElementById('whatsapp');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');
const mapLinkInput = document.getElementById('mapLink');
const aboutInput = document.getElementById('about');
const facebookInput = document.getElementById('facebook');
const instagramInput = document.getElementById('instagram');
const youtubeInput = document.getElementById('youtube');
const offersContainer = document.getElementById('offersContainer');
const addOfferBtn = document.getElementById('addOffer');
const editForm = document.getElementById('editForm');
const updateBtn = document.getElementById('updateBtn');
const cancelBtn = document.getElementById('cancelBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

let currentCardData = null;
let offerCount = 0;

// Load existing card data
async function loadCardData() {
    if (!cardId) {
        showNotification('No card ID provided', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('cards')
            .select('data')
            .eq('id', cardId)
            .single();
        
        if (error) throw error;
        
        if (data) {
            currentCardData = JSON.parse(data.data);
            populateForm(currentCardData);
        }
    } catch (error) {
        console.error('Error loading card:', error);
        showNotification('Failed to load card', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
    }
}

function populateForm(cardData) {
    // Basic info
    if (cardData.profileImage) {
        imagePreview.src = cardData.profileImage;
        imagePreview.style.display = 'block';
    }
    
    fullNameInput.value = cardData.fullName;
    phoneInput.value = cardData.phone;
    whatsappInput.value = cardData.whatsapp || '';
    emailInput.value = cardData.email;
    addressInput.value = cardData.address;
    mapLinkInput.value = cardData.mapLink || '';
    aboutInput.value = cardData.about;
    facebookInput.value = cardData.facebook || '';
    instagramInput.value = cardData.instagram || '';
    youtubeInput.value = cardData.youtube || '';
    
    // Load offers
    loadOffers(cardData.offers);
}

function loadOffers(offers) {
    offersContainer.innerHTML = '<h3>Special Offers (3-5 offers)</h3>';
    addOfferBtn.style.display = 'block';
    offersContainer.appendChild(addOfferBtn);
    
    offerCount = 0;
    offers.forEach((offer, index) => {
        addOfferForm();
        const forms = document.querySelectorAll('.offer-form');
        const currentForm = forms[index];
        
        currentForm.querySelector('.offer-title').value = offer.title;
        currentForm.querySelector('.offer-desc').value = offer.description;
        
        if (offer.image) {
            const preview = currentForm.querySelector('.offer-preview');
            preview.src = offer.image;
            preview.style.display = 'block';
        }
    });
}

// Image preview
profileImageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Add offer form
addOfferBtn.addEventListener('click', addOfferForm);

function addOfferForm() {
    if (offerCount >= 5) {
        showNotification('Maximum 5 offers allowed', 'error');
        return;
    }
    
    offerCount++;
    const offerDiv = document.createElement('div');
    offerDiv.className = 'offer-form';
    offerDiv.innerHTML = `
        <h4>Offer ${offerCount}</h4>
        <div class="form-group">
            <label>Title <span class="required">*</span></label>
            <input type="text" class="offer-title" placeholder="Special Discount" required>
        </div>
        <div class="form-group">
            <label>Description <span class="required">*</span></label>
            <textarea class="offer-desc" placeholder="Describe this offer..." rows="2" required></textarea>
        </div>
        <div class="form-group">
            <label>Offer Image (Max 100KB)</label>
            <input type="file" class="offer-image" accept="image/*">
            <img class="offer-preview" style="width: 80px; height: 80px; object-fit: cover; display: none; margin-top: 10px;">
        </div>
        ${offerCount > 3 ? '<button type="button" class="remove-offer-btn">Remove Offer</button>' : ''}
    `;
    
    if (offerCount > 3) {
        offerDiv.querySelector('.remove-offer-btn').addEventListener('click', function() {
            offerDiv.remove();
            offerCount--;
        });
    }
    
    // Image preview for offer image
    const offerImageInput = offerDiv.querySelector('.offer-image');
    const offerPreview = offerDiv.querySelector('.offer-preview');
    
    offerImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                offerPreview.src = e.target.result;
                offerPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    offersContainer.insertBefore(offerDiv, addOfferBtn);
}

// Cancel button
cancelBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to cancel? Changes will be lost.')) {
        window.location.href = `card.html?id=${cardId}`;
    }
});

// Form submission
editForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    updateBtn.disabled = true;
    loadingSpinner.classList.remove('hidden');
    
    try {
        // Collect form data
        const updatedData = {
            fullName: fullNameInput.value.trim(),
            phone: phoneInput.value.trim(),
            whatsapp: whatsappInput.value.trim() || phoneInput.value.trim(),
            email: emailInput.value.trim(),
            address: addressInput.value.trim(),
            mapLink: mapLinkInput.value.trim() || `https://maps.google.com/?q=${encodeURIComponent(addressInput.value.trim())}`,
            about: aboutInput.value.trim(),
            facebook: facebookInput.value.trim(),
            instagram: instagramInput.value.trim(),
            youtube: youtubeInput.value.trim(),
            offers: [],
            updatedAt: new Date().toISOString()
        };
        
        // Handle profile image
        const profileImage = profileImageInput.files[0];
        if (profileImage) {
            const resizedImage = await resizeImage(profileImage, 100);
            updatedData.profileImage = resizedImage;
        } else if (currentCardData?.profileImage) {
            updatedData.profileImage = currentCardData.profileImage;
        }
        
        // Handle offers
        const offerForms = document.querySelectorAll('.offer-form');
        for (const form of offerForms) {
            const offer = {
                title: form.querySelector('.offer-title').value.trim(),
                description: form.querySelector('.offer-desc').value.trim()
            };
            
            const offerImage = form.querySelector('.offer-image').files[0];
            if (offerImage) {
                const resizedOfferImage = await resizeImage(offerImage, 100);
                offer.image = resizedOfferImage;
            } else {
                // Try to keep existing image
                const existingOfferIndex = Array.from(offerForms).indexOf(form);
                if (currentCardData?.offers?.[existingOfferIndex]?.image) {
                    offer.image = currentCardData.offers[existingOfferIndex].image;
                }
            }
            
            updatedData.offers.push(offer);
        }
        
        // Keep created date
        if (currentCardData?.createdAt) {
            updatedData.createdAt = currentCardData.createdAt;
        }
        
        // Update in Supabase
        const { error } = await supabase
            .from('cards')
            .update({ data: JSON.stringify(updatedData) })
            .eq('id', cardId);
        
        if (error) throw error;
        
        // Update localStorage
        localStorage.setItem(`card_${cardId}`, JSON.stringify(updatedData));
        
        showNotification('Card updated successfully!', 'success');
        
        // Redirect back to card
        setTimeout(() => {
            window.location.href = `card.html?id=${cardId}`;
        }, 1500);
        
    } catch (error) {
        console.error('Error updating card:', error);
        showNotification('Failed to update card', 'error');
    } finally {
        updateBtn.disabled = false;
        loadingSpinner.classList.add('hidden');
    }
});

function validateForm() {
    // Validate email
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate phone
    const phone = phoneInput.value.trim();
    if (!validatePhone(phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    // Check offers count
    const offerForms = document.querySelectorAll('.offer-form');
    if (offerForms.length < 3) {
        showNotification('Please add at least 3 offers', 'error');
        return false;
    }
    
    if (offerForms.length > 5) {
        showNotification('Maximum 5 offers allowed', 'error');
        return false;
    }
    
    // Validate each offer
    let isValid = true;
    offerForms.forEach((form, index) => {
        const title = form.querySelector('.offer-title').value.trim();
        const desc = form.querySelector('.offer-desc').value.trim();
        
        if (!title || !desc) {
            showNotification(`Please fill all fields for Offer ${index + 1}`, 'error');
            isValid = false;
        }
    });
    
    return isValid;
}

// Initialize
loadCardData();
