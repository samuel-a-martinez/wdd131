document.addEventListener('DOMContentLoaded', function(){
  const lastModifiedParagraph = document.getElementById('lastModified');
  if (lastModifiedParagraph) {
    const lastModifiedDate = document.lastModified;
    lastModifiedParagraph.textContent = `Last Modification: ${lastModifiedDate}`;
  }
});