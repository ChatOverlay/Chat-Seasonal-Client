// Function to hide the scrollbar on mobile
export const hideScrollbarOnMobile = () => {
    const element = document.querySelector('.navbar__list');
    const mediaQuery = window.matchMedia('(max-width: 480px)');
    if (mediaQuery.matches) { // Check if the screen width is less than or equal to 480px
      element.style.overflowY = 'hidden';
    } else {
      element.style.overflowY = 'auto'; // Default overflow style
    }
  };
  
  // Function to add a bounce effect on scroll
  export const addBounceEffect = () => {
    const element = document.querySelector('.navbar__list');
    element.addEventListener('scroll', () => {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const height = element.clientHeight;
  
      if (scrollTop === 0) {
        element.scrollTop = 1; // slight adjustment when at the top
      } else if (height + scrollTop >= scrollHeight) {
        element.scrollTop = scrollTop - 1; // slight adjustment when at the bottom
      }
    });
  };
  