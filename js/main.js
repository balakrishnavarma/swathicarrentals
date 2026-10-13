// main.js - Core functionality and UI logic

document.addEventListener('DOMContentLoaded', () => {
    // Load Navbar
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <nav class="navbar">
                <div class="nav-container">
                    <a href="index.html" class="navbar-brand">
                        <img src="assets/images/logo_transparent.png" alt="Swathi Car Rentals Logo" class="nav-logo">
                        <span class="nav-brand-text">Swathi Car Rentals</span>
                    </a>
                    <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle navigation">
                        <i class="fas fa-bars"></i>
                    </button>
                    <ul class="navbar-nav" id="navbar-nav">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="cars.html">Cars</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
            </nav>
        `;

        // Mobile Menu Toggle
        const menuBtn = document.getElementById('mobile-menu-btn');
        const nav = document.getElementById('navbar-nav');
        
        if(menuBtn && nav) {
            menuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
        }
    }

    // Load Footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer class="footer">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-col">
                            <h4>Swathi Car Rentals</h4>
                            <p class="text-muted" style="color: var(--color-text-muted);">Premium self-drive car rentals for comfortable and flexible travel.</p>
                        </div>
                        <div class="footer-col">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="cars.html">Our Fleet</a></li>
                                <li><a href="about.html">About Us</a></li>
                                <li><a href="contact.html">Contact</a></li>
                                <li><a href="admin.html" style="color: #64748b; font-size: 0.85rem;"><i class="fas fa-lock"></i> Admin</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>Legal</h4>
                            <ul>
                                <li><a href="#">Terms & Conditions</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Cancellation Policy</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h4>Contact Us</h4>
                            <ul style="color: var(--color-text-muted);">
                                <li><i class="fas fa-phone text-accent"></i> +91 79813 72766</li>
                                <li><i class="fab fa-whatsapp text-accent"></i> +91 79813 72766</li>
                                <li><i class="fas fa-envelope text-accent"></i> swathicarrentals@gmail.com</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </footer>
        `;
    }
    
    // Search Form Logic (Phase 2 Interactivity)
    const searchForm = document.getElementById('mainSearchForm');
    const pickupDate = document.getElementById('pickupDate');
    const returnDate = document.getElementById('returnDate');
    const searchBtn = document.getElementById('searchCarsBtn');
    
    if (searchForm && pickupDate && returnDate && searchBtn) {
        // Set minimum date to today (current time) for pickup
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const minDateTime = now.toISOString().slice(0, 16);
        
        pickupDate.min = minDateTime;
        
        // When pickup date changes, update minimum return date
        pickupDate.addEventListener('change', () => {
            returnDate.min = pickupDate.value;
            // if return date is earlier than new pickup date, reset it
            if (returnDate.value && returnDate.value < pickupDate.value) {
                returnDate.value = pickupDate.value;
            }
        });
        
        // Handle Search Button Click
        searchBtn.addEventListener('click', () => {
            if (searchForm.checkValidity()) {
                // If form is valid, simulate a search by scrolling to fleet
                const fleetSection = document.getElementById('fleet');
                if (fleetSection) {
                    fleetSection.scrollIntoView({ behavior: 'smooth' });
                    // Optionally alert success (can be removed later)
                    // alert('Searching for available cars...');
                } else {
                    window.location.href = "cars.html";
                }
            } else {
                // Trigger HTML5 validation UI
                searchForm.reportValidity();
            }
        });
    }


});
