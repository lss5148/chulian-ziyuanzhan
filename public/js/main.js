// Main JS for 初恋资源站
document.addEventListener('DOMContentLoaded', function() {
  // Activate carousel auto-play
  var carousel = document.querySelector('#featuredCarousel');
  if (carousel) {
    new bootstrap.Carousel(carousel, {
      interval: 5000,
      pause: 'hover'
    });
  }
});
