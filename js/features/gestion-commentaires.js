// ############### MOTEUR COMMENTAIRE ################ //

function getXMLHttpRequest(){
	var objetXHR = null;
	try{
		objetXHR = new XMLHttpRequest();
	}catch(Error){
		objetXHR = new ActiveXObject("Msxml2.XMLHTTP");
	}
	return objetXHR;
}

/**
 * Cette fonction ajax permet d'ajouter un commentaire sur le mur du profil.
 * @param ID_PROPRIO identifiant du proprietaire du commentaire
 * @param ID_ACTU identifiant de l'actualité à laquelle se rapporte le commentaire.
 * @returns retourne faux par defaut pour éviter le rechargement de la page.
 */
function requeteAjoutCommentaireProfil(ID_PROPRIO, ID_ACTU){
	var objetXHR = getXMLHttpRequest();
	var TEXTE_COMMENTAIRE = document.getElementById("new_commentaire_"+ID_ACTU).value;
	
	if(TEXTE_COMMENTAIRE != ""){
		objetXHR.onreadystatechange = function(){
			if(objetXHR.readyState == 4){ // La requete est termine
				readData(objetXHR.responseText, ID_PROPRIO, ID_ACTU);
			}
		};
		objetXHR.open("post", PATH+"/AjoutCommentaire", true);
		objetXHR.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var variablesPOST = "texte_commentaire="+TEXTE_COMMENTAIRE+"&id_compte="+ID_PROPRIO+"&id_actu="+ID_ACTU;
		objetXHR.send(variablesPOST);
		document.getElementById("new_commentaire_"+ID_ACTU).value = "";
	}
	return(false);
}

/**
 * Cette fonction ajax permet d'ajouter un commentaire sur le mur général.
 * @param ID_PROPRIO identifiant du proprietaire du commentaire
 * @param ID_ACTU identifiant de l'actualité à laquelle se rapporte le commentaire.
 * @returns retourne faux par defaut pour éviter le rechargement de la page.
 */
function requeteAjoutCommentaireActus(ID_PROPRIO, ID_ACTU){
	var objetXHR = getXMLHttpRequest();
	var TEXTE_COMMENTAIRE = document.getElementById("new_commentaire_"+ID_ACTU).value;
	
	if(TEXTE_COMMENTAIRE != ""){
		objetXHR.onreadystatechange = function(){
			if(objetXHR.readyState == 4){ // La requete est termine
				readData(objetXHR.responseText, ID_PROPRIO, ID_ACTU);
			}
		};
		objetXHR.open("post", PATH+"/AjoutCommentaireActus", true);
		objetXHR.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var variablesPOST = "texte_commentaire="+TEXTE_COMMENTAIRE+"&id_compte="+ID_PROPRIO+"&id_actu="+ID_ACTU;
		objetXHR.send(variablesPOST);
		document.getElementById("new_commentaire_"+ID_ACTU).value = "";
	}
	return(false);
}

/**
 * Cette fonction ajax permet d'ajouter un commentaire sur le mur d'un ami.
 * @param ID_PROPRIO identifiant du proprietaire du commentaire
 * @param ID_ACTU identifiant de l'actualité à laquelle se rapporte le commentaire.
 * @returns retourne faux par defaut pour éviter le rechargement de la page.
 */
function requeteAjoutCommentaireAmis(ID_PROPRIO, ID_ACTU){
	var objetXHR = getXMLHttpRequest();
	var TEXTE_COMMENTAIRE = document.getElementById("new_commentaire_"+ID_ACTU).value;
	
	if(TEXTE_COMMENTAIRE != ""){
		objetXHR.onreadystatechange = function(){
			if(objetXHR.readyState == 4){ // La requete est termine
				readData(objetXHR.responseText, ID_PROPRIO, ID_ACTU);
			}
		};
		objetXHR.open("post", PATH+"/AjoutCommentaireAmis", true);
		objetXHR.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var variablesPOST = "texte_commentaire="+TEXTE_COMMENTAIRE+"&id_compte="+ID_PROPRIO+"&id_actu="+ID_ACTU;
		objetXHR.send(variablesPOST);
		document.getElementById("new_commentaire_"+ID_ACTU).value = "";
	}
	return(false);
}

/**
 * Fonction JS qui va modifier l'arbre DOM de la page courante.
 * @param data données retrouner par l'appel de la fonction AJAX.
 * @param ID_PROPRIO id du proprietaire du commentaire.
 * @param ID_ACTUALITE id de l'actualité
 * @returns retourne faux par defaut pour éviter le rechargement de la page.
 */
function readData(data, ID_PROPRIO, ID_ACTUALITE){
	var tab = data.split("|");
	
	// Variable agissant sur les noeuds.
	var ID_COMMENTAIRE = tab[0];
	var LIEN_PHOTO = tab[1];
	var NOM_AUTEUR = tab[2];
	var TEXTE_COMMENTAIRE = tab[3];
	var DATE_CREATION = tab[4];
	var AUTEUR_LIEN = tab[5];

	// Modification du DOM
	var noeud_commentaires_amis = document.createElement("div");
	var noeud_commentaires_photos = document.createElement("div");
	var noeud_photo = document.createElement("img");
	var noeud_auteur = document.createElement("span");
	var noeud_lien_auteur = document.createElement("a");
	var noeud_auteur_texte = document.createTextNode(NOM_AUTEUR);
	var noeud_commentaires_amis_texte = document.createTextNode(" "+TEXTE_COMMENTAIRE);
	var noeud_date_creation = document.createElement('div');
	var noeud_date_creation_texte = document.createTextNode(DATE_CREATION+" ");
	var noeud_aime = document.createElement('span');
	var noeud_aime_lien = document.createElement('a');
	var noeud_aime_lien_texte = document.createTextNode("J'aime");
	noeud_aime.setAttribute('class', 'aime_commentaire');
	noeud_aime_lien.setAttribute("onclick", "requeteAimeCommentaire("+ID_PROPRIO+", "+ID_COMMENTAIRE+", "+ID_ACTUALITE+");");
	noeud_aime_lien.setAttribute('style', 'cursor: pointer;');
	noeud_commentaires_amis.setAttribute('class', 'commentaires_amis');
	noeud_commentaires_amis.setAttribute('id', "com_"+ID_COMMENTAIRE);
	noeud_commentaires_photos.setAttribute('class', 'commentaires_photos');
	noeud_lien_auteur.href = AUTEUR_LIEN;
	noeud_photo.src = PATH+LIEN_PHOTO;
	noeud_photo.alt = NOM_AUTEUR;
	noeud_auteur.setAttribute('class', 'proprio_commentaire');
	noeud_date_creation.setAttribute('class','date_creation_actu');


	// Liaison des noeuds AJAX.
	noeud_commentaires_amis.appendChild(noeud_commentaires_photos);
	noeud_commentaires_amis.appendChild(noeud_auteur);
	noeud_commentaires_amis.appendChild(noeud_commentaires_amis_texte);
	noeud_commentaires_amis.appendChild(noeud_date_creation);
	noeud_commentaires_photos.appendChild(noeud_photo);
	noeud_auteur.appendChild(noeud_lien_auteur);
	noeud_lien_auteur.appendChild(noeud_auteur_texte);
	noeud_date_creation.appendChild(noeud_date_creation_texte);
	noeud_date_creation.appendChild(noeud_aime);
	noeud_aime.appendChild(noeud_aime_lien);
	noeud_aime_lien.appendChild(noeud_aime_lien_texte);
	document.getElementById("commentaire_actus_"+ID_ACTUALITE).appendChild(noeud_commentaires_amis);
	return(false);
}


function requeteAimeCommentaire(ID_PROPRIO, ID_COMMENTAIRE, ID_ACTUALITE){
	var objetXHR = getXMLHttpRequest();
	objetXHR.onreadystatechange = function(){
		if(objetXHR.readyState == 4){ // La requete est termine
			aimeCa(objetXHR.responseText, ID_COMMENTAIRE, ID_ACTUALITE, ID_PROPRIO);
		}
	};
	// traitement cote serveur.
	objetXHR.open("get", PATH+"/AimeCommentaire?com="+ID_COMMENTAIRE+"&actu="+ID_ACTUALITE, true);
	objetXHR.send(null);

	return(false);
}

function aimeCa(data, ID_COMMENTAIRE, ID_ACTUALITE, ID_PROPRIO){
	var tab = data.split("|");
	var NB_JAIME = tab[0];
	var commentaire = document.getElementById("com_"+ID_COMMENTAIRE);
	var spanTags = commentaire.getElementsByTagName("span");
	if(NB_JAIME == 1){
		while(spanTags[1].hasChildNodes()){
			spanTags[1].removeChild(spanTags[1].firstChild);
		}
		
		var node_vous_aimez = document.createTextNode(" - Vous aimez");
		var node_aime_plus = document.createElement("a");
		node_aime_plus.setAttribute("onclick", "requeteAimePlusCommentaire("+ID_PROPRIO+", "+ID_ACTUALITE+", "+ID_COMMENTAIRE+")");
		node_aime_plus.setAttribute('style', 'cursor: pointer;');
		node_aime_plus.appendChild(document.createTextNode("Je n'aime plus"));
		spanTags[1].appendChild(node_aime_plus);
		spanTags[1].appendChild(node_vous_aimez);
	}else{
		// On efface les noeuds enfant du noeud span.
		while(spanTags[1].hasChildNodes()){
			spanTags[1].removeChild(spanTags[1].firstChild);
		}
		var node_aime_plus = document.createElement("a");
		node_aime_plus.setAttribute("onclick", "requeteAimePlusCommentaire("+ID_PROPRIO+", "+ID_ACTUALITE+", "+ID_COMMENTAIRE+")");
		node_aime_plus.setAttribute('style', 'cursor: pointer;');
		node_aime_plus.appendChild(document.createTextNode("Je n'aime plus"));
		var node_lien_personnes = document.createElement("a");
		node_lien_personnes.setAttribute('onclick', "requeteAfficheAime("+ID_COMMENTAIRE+", "+PATH+")");
		node_lien_personnes.setAttribute('style', 'cursor: pointer;');
		node_lien_personnes.appendChild(document.createTextNode(" "+NB_JAIME+" personnes"));
		var node_fin_lien_personne = document.createTextNode(" aime ça");
		spanTags[1].appendChild(node_aime_plus);
		spanTags[1].appendChild(document.createTextNode(" - "));
		spanTags[1].appendChild(node_lien_personnes);
		spanTags[1].appendChild(node_fin_lien_personne);
	}
}

function requeteAimePlusCommentaire(ID_PROPRIO, ID_ACTUALITE, ID_COMMENTAIRE){
	var objetXHR = getXMLHttpRequest();
	objetXHR.onreadystatechange = function(){
		if(objetXHR.readyState == 4){ // La requete est termine
			aimePlusCa(objetXHR.responseText, ID_PROPRIO, ID_ACTUALITE, ID_COMMENTAIRE);
		}
	};
	// traitement cote serveur.
	objetXHR.open("get", PATH+"/SupprimerAime?id_proprietaire="+ID_PROPRIO+"&id_commentaire="+ID_COMMENTAIRE , true);
	objetXHR.send(null);
	return(false);
}

function aimePlusCa(data, ID_PROPRIO, ID_ACTUALITE, ID_COMMENTAIRE){
	var tab = data.split("|");
	var NB_JAIME = tab[0];
	var commentaire = document.getElementById("com_"+ID_COMMENTAIRE);
	var spanTags = commentaire.getElementsByTagName("span");
	
	// Enumeration des differents cas possibles.
	if(NB_JAIME == 0){
		while(spanTags[1].hasChildNodes()){
			spanTags[1].removeChild(spanTags[1].firstChild);
		}
		var node_aime = document.createElement("a");
		node_aime.setAttribute("onclick", "requeteAimeCommentaire("+ID_PROPRIO+", "+ID_COMMENTAIRE+", "+ID_ACTUALITE+");");
		node_aime.setAttribute('style', 'cursor: pointer;');
		node_aime.appendChild(document.createTextNode("J'aime"));
		spanTags[1].appendChild(node_aime);
	}else if(NB_JAIME == 1){
		// On efface les noeuds enfant du noeud span.
		while(spanTags[1].hasChildNodes()){
			spanTags[1].removeChild(spanTags[1].firstChild);
		}
		// Creation du lien " J'aime "
		var node_aime = document.createElement("a");
		node_aime.setAttribute("onclick", "requeteAimeCommentaire("+ID_PROPRIO+", "+ID_COMMENTAIRE+", "+ID_ACTUALITE+");");
		node_aime.setAttribute('style', 'cursor: pointer;');
		node_aime.appendChild(document.createTextNode("J'aime"));
		
		// Creation du lien " 2 personnes "
		var node_lien_personnes = document.createElement("a");
		node_lien_personnes.setAttribute('onclick', "requeteAfficheAime("+ID_COMMENTAIRE+", "+PATH+")");
		node_lien_personnes.setAttribute('style', 'cursor: pointer;');
		node_lien_personnes.appendChild(document.createTextNode(" "+NB_JAIME+" personne"));
		
		// Creation du noeud " aiment ca "
		var node_fin_lien_personne = document.createTextNode(" aime ça");
		
		// On relie les noeuds.
		spanTags[1].appendChild(node_aime);
		spanTags[1].appendChild(document.createTextNode(" - "));
		spanTags[1].appendChild(node_lien_personnes);
		spanTags[1].appendChild(node_fin_lien_personne);
	}else{
		// On efface les noeuds enfant du noeud span.
		while(spanTags[1].hasChildNodes()){
			spanTags[1].removeChild(spanTags[1].firstChild);
		}
		// Creation du lien " J'aime "
		var node_aime = document.createElement("a");
		node_aime.setAttribute("onclick", "requeteAimeCommentaire("+ID_PROPRIO+", "+ID_COMMENTAIRE+", "+ID_ACTUALITE+");");
		node_aime.setAttribute('style', 'cursor: pointer;');
		node_aime.appendChild(document.createTextNode("J'aime"));
		
		// Creation du lien " 2 personnes "
		var node_lien_personnes = document.createElement("a");
		node_lien_personnes.setAttribute('onclick', "requeteAfficheAime("+ID_COMMENTAIRE+", "+PATH+")");
		node_lien_personnes.setAttribute('style', 'cursor: pointer;');
		node_lien_personnes.appendChild(document.createTextNode(" "+NB_JAIME+" personnes"));
		
		// Creation du noeud " aiment ça "
		var node_fin_lien_personne = document.createTextNode(" aiment ça");
		
		// On relie les noeuds.
		spanTags[1].appendChild(node_aime);
		spanTags[1].appendChild(document.createTextNode(" - "));
		spanTags[1].appendChild(node_lien_personnes);
		spanTags[1].appendChild(node_fin_lien_personne);
	}
}