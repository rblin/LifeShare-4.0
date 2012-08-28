$(document).ready(function(){
	//Configuration
	var retour = true;
	var tempsTransition = 750;
	var currentPosition = 0;
	var slideWidth = 1200;
	var slides = $('.slide');
	var numberOfSlides = slides.length;

  // Attribue  #slideInner  toutes les div .slide
	slides.wrapAll('<div id="slideInner"></div>').css({'float' : 'left', 'width' : slideWidth});
	$('#slideInner').css('width', slideWidth * numberOfSlides);
	manageControls(currentPosition);

  //Création d'un event de type clic sur les classes .control
	$('.control').bind('click', function(){
			
		// Determine la nouvelle position
		currentPosition = ($(this).attr('id')=='rightControl') ? currentPosition+1 : currentPosition-1;
		
		if(currentPosition == numberOfSlides && retour == false && currentPosition != 0 ){
			currentPosition--;
			pause();
		}
		if(currentPosition == numberOfSlides && retour == true){
			currentPosition = 0;
			pause();
		}
		if(currentPosition == -1 && retour == true){
			currentPosition = numberOfSlides -1 ;
			pause();
		}
		manageControls(currentPosition);
		// Fais bouger le slide
		$('#slideInner').animate({'marginLeft' : slideWidth*(-currentPosition)},tempsTransition);
	});

	function manageControls(position){
		$('#leftControl').show();
		$('#rightControl').show();
	}
	function suivant(){
		$('#rightControl').click();
	}
	function start() {
		lectureEnCours = true;
		interval = setInterval(suivant, tempsAttente );
	}
	function pause() {
		lectureEnCours = false;
	}
});