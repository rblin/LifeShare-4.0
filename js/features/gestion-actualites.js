NB_RETURN = 1;

function retourLigne(){
	var textarea = document.getElementById("new_actu");
	NB_RETURN++;
	textarea.style.height = (NB_RETURN * 20)+"px";
}

function getXMLHttpRequest(){
	var objetXHR = null;
	try{
		objetXHR = new XMLHttpRequest();
	}catch(Error){
		objetXHR = new ActiveXObject("Msxml2.XMLHTTP");
	}
	return objetXHR;
}


function requeteSupActu(ID_ACTU){
	var objetXHR = getXMLHttpRequest();
	objetXHR.onreadystatechange = function(){
		if(objetXHR.readyState == 4){ // La requete est termine
			SupActu(ID_ACTU);
		}
	};
	// traitement cote serveur.
	objetXHR.open("get", "SupprimerActualite?id_actu="+ID_ACTU , true);
	objetXHR.send(null);
	return(false);
}

function SupActu(ID_ACTU){
	var actualite = document.getElementById("actualite_"+ID_ACTU);
	while(actualite.hasChildNodes()){
		actualite.removeChild(actualite.firstChild);
	}
	actualite.parentNode.removeChild(actualite);
}

function requeteAimeActus(ID_ACTU, ID_PROPRIO){
	var objetXHR = getXMLHttpRequest();
	objetXHR.onreadystatechange = function(){
		if(objetXHR.readyState == 4){ // La requete est termine
			aimeActus(objetXHR.responseText, ID_ACTU, ID_PROPRIO);
		}
	};
	objetXHR.open("get", PATH+"/AimeActualite?actu="+ID_ACTU, true);
	objetXHR.send(null);
	return(false);
}

function aimeActus(data, ID_ACTU, ID_PROPRIO ){
	// Nous recupérons l'id du noeud " Aime crée et le nombre de personne qui "aime ça".
	var tab = data.split("|");
	var NB_AIME = tab[0];
	var actualite = document.getElementById("contenu_aime_ca_"+ID_ACTU);
	// On detruit les fils
	while(actualite.hasChildNodes()){
		actualite.removeChild(actualite.firstChild);
	}
	// Le noeud est vierge et près à être traité.
	if(NB_AIME == 1){ // Autrement dit, il n'y a que vous qui avez cliqué sur j'aime.

		// Création du noeud " Je n'aime plus "
		var node_lien_aime_plus = document.createElement("a");
		node_lien_aime_plus.setAttribute("onclick", "requeteAimePlusActus("+ID_ACTU+", "+ID_PROPRIO+")");
		node_lien_aime_plus.setAttribute("style", "cursor : pointer;");
		node_lien_aime_plus.appendChild(document.createTextNode("Je n'aime plus"));
		
		// Création du noeud " Vous aimez. "
		var node_vous_aimez = document.createTextNode("Vous aimez. - ");
		
		// Vous aimez l'actualité donc vous y êtes abonné.
		var node_lien_abonnement = document.createElement("a");
		node_lien_abonnement.href = PATH+"/SupprimerAbonnement?id="+ID_PROPRIO+"&actu="+ID_ACTU;
		node_lien_abonnement.appendChild(document.createTextNode("Annuler l'abonnement"));
		
		// On raccorde les nouveaux noeuds au document.
		actualite.appendChild(node_vous_aimez);
		actualite.appendChild(node_lien_aime_plus);
		actualite.appendChild(document.createTextNode(" - "));
		actualite.appendChild(node_lien_abonnement);

	}else{ // Vous n'êtes pas le seul à aimer ça donc il faut aussi mette un lien vers les personnes qui aiment ça.
		// Vous et 1 personnes aime ça. - Je n'aime plus - Annuler l'abonnement
		// Création du noeud "Vous et "
		var node_vous_et = document.createTextNode("Vous et ");
		
		// Création du noeud " 2 personnes"
		var node_lien_personnes = document.createElement("a");
		node_lien_personnes.setAttribute('onclick', "requeteAfficheAime("+ID_ACTU+", "+PATH+")");
		node_lien_personnes.setAttribute('style', 'cursor: pointer;');
		if(NB_AIME == 2){
			node_lien_personnes.appendChild(document.createTextNode(NB_AIME-1+" personne "));
		}else{
			node_lien_personnes.appendChild(document.createTextNode(NB_AIME-1+" personnes "));
		}
		
		// Creation du noeud " aiment ça"
		var node_aime_ca = null;
		if(NB_AIME == 2){
			node_aime_ca = document.createTextNode("aiment ça. - ");
		}else{
			node_aime_ca = document.createTextNode("aiment ça. - ");
		}
		
		// Création du noeud " Je n'aime plus "
		var node_lien_aime_plus = document.createElement("a");
		node_lien_aime_plus.setAttribute("onclick", "requeteAimePlusActus("+ID_ACTU+", "+ID_PROPRIO+")");
		node_lien_aime_plus.setAttribute("style", "cursor : pointer;");
		node_lien_aime_plus.appendChild(document.createTextNode("Je n'aime plus"));
		
		// Vous aimez l'actualité donc vous y êtes abonné.
		var node_lien_abonnement = document.createElement("a");
		node_lien_abonnement.href = "SupprimerAbonnement?id="+ID_PROPRIO+"&actu="+ID_ACTU;
		node_lien_abonnement.appendChild(document.createTextNode("Annuler l'abonnement"));
		
		//On relit les morceau au document
		actualite.appendChild(node_vous_et);
		actualite.appendChild(node_lien_personnes);
		actualite.appendChild(node_aime_ca);
		actualite.appendChild(node_lien_aime_plus);
		actualite.appendChild(document.createTextNode(" - "));
		actualite.appendChild(node_lien_abonnement);
	}
}




//Le client a cliqué sur "je n'aime plus".
function requeteAimePlusActus(ID_ACTU, ID_PROPRIO){
	var objetXHR = getXMLHttpRequest();
	objetXHR.onreadystatechange = function(){
		if(objetXHR.readyState == 4){ // La requete est termine
			aimePlusActus(objetXHR.responseText, ID_ACTU, ID_PROPRIO);
		}
	};
	objetXHR.open("get", PATH+"/SupprimerAime?id_proprietaire="+ID_PROPRIO+"&actu="+ID_ACTU, true);
	objetXHR.send(null);
	return(false);
}

// Reconstruction du DOM
function aimePlusActus(data, ID_ACTU, ID_PROPRIO){
	var NB_AIME = data;
	var actualite = document.getElementById("contenu_aime_ca_"+ID_ACTU);
	
	// On detruit les fils
	while(actualite.hasChildNodes()){
		actualite.removeChild(actualite.firstChild);
	}
	
	// L'utilisateur a cliquer sur " Je n'aime plus.
	if(NB_AIME == 0){
		// Creation du noeud " j'aime "
		var node_lien_aime = document.createElement("a");
		node_lien_aime.setAttribute("onclick", "requeteAimeActus("+ID_ACTU+", "+ID_PROPRIO+");");
		node_lien_aime.setAttribute("style", "cursor : pointer;");
		node_lien_aime.appendChild(document.createTextNode("J'aime"));
		
		// Creation du noeud : " Annuler l'abonnement"
		var node_lien_abonnement = document.createElement("a");
		node_lien_abonnement.href = "SupprimerAbonnement?id="+ID_PROPRIO+"&actu="+ID_ACTU;
		node_lien_abonnement.appendChild(document.createTextNode("Annuler l'abonnement"));
		
		// Reccordement au DOM
		actualite.appendChild(node_lien_aime);
		actualite.appendChild(document.createTextNode(" - "));
		actualite.appendChild(node_lien_abonnement);
	}else{
		// Creation du noeud " j'aime "
		var node_lien_aime = document.createElement("a");
		node_lien_aime.setAttribute("onclick", "requeteAimeActus("+ID_ACTU+", "+ID_PROPRIO+");");
		node_lien_aime.setAttribute("style", "cursor : pointer;");
		node_lien_aime.appendChild(document.createTextNode("J'aime"));
		
		// Création du noeud " 2 personnes"
		var node_lien_personnes = document.createElement("a");
		node_lien_personnes.setAttribute('onclick', "requeteAfficheAime("+ID_ACTU+", "+PATH+")");
		node_lien_personnes.setAttribute('style', 'cursor: pointer;');
		if(NB_AIME == 1){
			node_lien_personnes.appendChild(document.createTextNode(NB_AIME+" personne"));
		}else{
			node_lien_personnes.appendChild(document.createTextNode(NB_AIME+" personnes"));
		}
		
		// Creation du noeud " aiment ça"
		var node_aime_ca = null;
		if(NB_AIME == 1){
			node_aime_ca = document.createTextNode(" aime ça. - ");
		}else{
			node_aime_ca = document.createTextNode(" aiment ça. - ");
		}
		// Creation du noeud : " Annuler l'abonnement"
		var node_lien_abonnement = document.createElement("a");
		node_lien_abonnement.href = "SupprimerAbonnement?id="+ID_PROPRIO+"&actu="+ID_ACTU;
		node_lien_abonnement.appendChild(document.createTextNode("Annuler l'abonnement"));
	
		// On relie les noeuds au DOM
		actualite.appendChild(node_lien_aime);
		actualite.appendChild(document.createTextNode(" - "));
		actualite.appendChild(node_lien_personnes);
		actualite.appendChild(node_aime_ca);
		actualite.appendChild(node_lien_abonnement);
	}
}

function requeteAfficheAime(ID_REF, PATH){
	var objetXHR = getXMLHttpRequest();
	objetXHR.onreadystatechange = function(){
		if(objetXHR.readyState == 4){ // La requete est termine
			afficherAime(objetXHR.responseText, PATH);
		}
	};
		objetXHR.open("get", "AfficheAime?idRef="+ID_REF, true);
		objetXHR.send(null);
	return(false);
}

function afficherAime(data, PATH){
	// On traite le XML Request afin de transformer les information en tableau
	var tab = data.split("|");
	var tab_id = Array();
	var tab_url_photo = Array();
	var tab_nom = Array();
	var i = 0;
	var j = 0;
	for(i = 0 ; i < tab.length ; ){
		tab_id[j] = tab[i];
		tab_nom[j] = tab[i+1];
		tab_url_photo[j] = tab[i+2];
		i+=3;
		j++;
	}
	// On a maintenant 3 tableaux qui contiennent les elements necessaire pour modifier le DOM
	// On met en place la structure d'affichage en HTML
	while(document.getElementById("jaime").hasChildNodes()){
		document.getElementById("jaime").removeChild(document.getElementById("jaime").firstChild);
	}
	
	var noeud_table = document.createElement("table");
	var noeud_tr = null;
	var noeud_td1 = null;
	var noeud_td2 = null;
	var noeud_img_div_td1 = null;
	for(i = 0 ; i < tab_id.length - 1 ; i++){
		// Mise en place d'une ligne
		noeud_tr = document.createElement("tr");
		noeud_td1 = document.createElement("td");
		noeud_td2 = document.createElement("td");
		// Mise en place du DIV
		noeud_div_td1 = document.createElement("div");
		noeud_div_td1.setAttribute('class', 'photo_aime_ca');
		noeud_td1.appendChild(noeud_div_td1);
		// Mise en plce du img
		noeud_img_div_td1 = document.createElement("img");
		noeud_img_div_td1.setAttribute('src', PATH+"/"+tab_url_photo[i]);
		noeud_img_div_td1.setAttribute('alt', PATH+"/"+tab_nom[i]);
		noeud_div_td1.appendChild(noeud_img_div_td1);
		// Mise en place du td2
		noeud_a_td2 = document.createElement("a");
		noeud_a_td2.setAttribute('href', PATH+"/explorateurMurAmis?idAmis="+tab_id[i]);
		noeud_a_td2.appendChild(document.createTextNode(tab_nom[i]));
		noeud_td2.appendChild(noeud_a_td2);
		// On relie les 2 TD au TR
		noeud_tr.appendChild(noeud_td1);
		noeud_tr.appendChild(noeud_td2);
		noeud_table.appendChild(noeud_tr);
	}
	document.getElementById("jaime").appendChild(noeud_table);
	//document.getElementById("jaime").appendChild(document.createTextNode(data));
	$(function(){
		$('#jaime').dialog("open");
	});

	return(false);
}


