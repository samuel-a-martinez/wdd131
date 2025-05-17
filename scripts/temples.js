document.addEventListener('DOMContentLoaded', function(){
  const lastModifiedParagraph = document.getElementById('lastModified');
  if (lastModifiedParagraph) {
    const lastModifiedDate = document.lastModified;
    lastModifiedParagraph.textContent = `Last Modification: ${lastModifiedDate}`;
  }
  const hamButton = document.querySelector('#menu');
  const navigation = document.querySelector('.navigation');

  hamButton.addEventListener('click', () => {
	  navigation.classList.toggle('open');
	  hamButton.classList.toggle('open');
  });
});