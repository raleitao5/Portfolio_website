document.addEventListener("DOMContentLoaded", () => {
    const dashboardContainer = document.getElementById("dashboardContainer");

    const categories = ["People", "Places", "Pets", "Animals", "Things"];

    const images = [
        'https://upload.wikimedia.org/wikipedia/commons/5/5f/AmeeshaPatel01.jpg',   // Replace these with your image URLs
        'https://upload.wikimedia.org/wikipedia/commons/5/5f/AmeeshaPatel01.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/5/5f/AmeeshaPatel01.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/5/5f/AmeeshaPatel01.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/5/5f/AmeeshaPatel01.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/5/5f/AmeeshaPatel01.jpg'
    ];

function createVoidCard() {
    const voidCard = document.createElement('div');
    voidCard.className = 'coverflow-item void-item';
    voidCard.style.scrollSnapAlign = 'none'
    return voidCard;
}

categories.forEach(categoryName => {
    const rowWrapper = document.createElement('div');
    rowWrapper.className = 'category-row';

    const title = document.createElement('h3');
    title.className = 'category-title';
    title.innerText = categoryName;
    rowWrapper.appendChild(title);

    const gallery = document.createElement('div');
    gallery.className = 'coverflow-container';


gallery.appendChild(createVoidCard());

    // Loop through the array and create the HTML structure for each item
    images.forEach(src => {
      const item = document.createElement('div');
      item.className = 'coverflow-item';

      const img = document.createElement('img');
      img.src = src;
      img.alt = `${categoryName} Image`;

      // Disables the browser's native image dragging behavior
      img.draggable = false;

      item.appendChild(img);
      gallery.appendChild(item);

    });

    gallery.appendChild(createVoidCard());
    rowWrapper.appendChild(gallery);
    dashboardContainer.appendChild(rowWrapper);

    // Select all the newly created gallery items
    const items = gallery.querySelectorAll('.coverflow-item:not(.void-item)');

    // Function to calculate positions and apply the 'active' class to the center item
    function updateCoverFlow() {
        const containerRect = gallery.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width /2;

            const distance = itemCenter - containerCenter;
            const absDistance = Math.abs(containerCenter - itemCenter);

            const normalizedDistance =absDistance / (containerRect.width /2);

            const scale = Math.max(0.4, 1.15 - (normalizedDistance *0.75));

            const opacity = Math.max(0.2, 1.0 - (normalizedDistance *0.85));

            const zIndex = Math.round(100 - (absDistance *100));

            const rotationAngle = Math.min(60, Math.max(-60, (distance / (containerRect.width / 2)) * -45));

            item.style.transform = `scale(${scale}) rotateY(${rotationAngle}deg)`;
            item.style.opacity = opacity;
            item.style.zIndex = zIndex;

            if (absDistance < itemRect.width /2) {
                item.classList.add('active');
            }
            else {
                item.classList.remove('active');
            }
        });
    }

// Listen for user scrolling or window resizing to recalculate positions
gallery.addEventListener('scroll', updateCoverFlow);
window.addEventListener('resize', updateCoverFlow);

// --- CLICK AND DRAG SCROLLING LOGIC ---
let isDown = false;
let startX;
let scrollLeft;

// When the user presses the mouse button down inside the gallery
gallery.addEventListener('mousedown', (e) => {
    isDown = true;
   
    startX = e.clientX - gallery.getBoundingClientRect().left;
    // Record the container's current horizontal scroll position
    scrollLeft = gallery.scrollLeft;
});

// When the mouse cursor leaves the gallery boundaries
gallery.addEventListener('mouseleave', () => {
    isDown = false;
    gallery.style.scrollBehavior ='smooth';
});

// When the user releases the mouse button
gallery.addEventListener('mouseup', () => {
    isDown = false;
    gallery.style.scrollBehavior ='smooth';
});

// When the mouse moves (only fires if isDown is true)
gallery.addEventListener('mousemove', (e) => {
    if (!isDown) return; // Exit early if the mouse isn't clicked down
    e.preventDefault(); // Prevent default text selection behavior

    // Calculate current mouse position relative to the gallery
    const x = e.clientX - gallery.getBoundingClientRect().left;
    // Calculate how far the mouse has moved (multiplied by 1.5 to adjust drag speed)
    const walk = (x - startX) *1.5;

    // Update the container's scroll position based on the drag distance
    gallery.scrollLeft = scrollLeft - walk;
});

// Run once on load and ensure initial measurement happens after layout
setTimeout(() => {
    if (items.length > 0) {
        const firstItem = items[0];
        const scrollTarget = firstItem.offsetLeft + (firstItem.offsetWidth /2) - (gallery.clientWidth / 2);
        gallery.scrollLeft = scrollTarget;
    }
    updateCoverFlow();
}, 50);
});
});