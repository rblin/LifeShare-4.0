function getXMLHttpRequest(){
	var objetXHR = null;
	try{
		objetXHR = new XMLHttpRequest();
	}catch(Error){
		objetXHR = new ActiveXObject("Msxml2.XMLHTTP");
	}
	return objetXHR;
}

function requeteDeplacementCercle(ID_AMI, ID_CERCLE){
	var objetXHR = getXMLHttpRequest();
	objetXHR.onreadystatechange = function(){
		if(objetXHR.readyState == 4){ // La requete est termine
		}
	};
	objetXHR.open("get", "AjoutAmiCercle?id_ami="+ID_AMI+"&id_cercle="+ID_CERCLE, true);
	objetXHR.send(null);
	return(false);
}

function requeteAfficheMembresCercle(ID_REF, PATH){
	var objetXHR = getXMLHttpRequest();
	objetXHR.onreadystatechange = function(){
		if(objetXHR.readyState == 4){ // La requete est termine
			afficherMembreCercle(objetXHR.responseText, PATH);
		}
	};
		objetXHR.open("get", "AfficheMembresCercle?idRef="+ID_REF, true);
		objetXHR.send(null);
	return(false);
}

function afficherMembreCercle(data, PATH){
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
		id_cercle = tab_id[i+3];
		i+=4;
		j++;
	}
	// On a maintenant 3 tableaux qui contiennent les éléments necessaires pour modifier le DOM
	// On met en place la structure d'affichage en HTML
	while(document.getElementById("membres_cercle").hasChildNodes()){
		document.getElementById("membres_cercle").removeChild(document.getElementById("membres_cercle").firstChild);
	}
	
	var noeud_table = document.createElement("table");
	var noeud_tr = null;
	var noeud_td1 = null;
	var noeud_td2 = null;
	var noeud_td3 = null;
	var noeud_img_div_td1 = null;
	for(i = 0 ; i < tab_id.length - 1 ; i++){
		// Mise en place d'une ligne
		noeud_tr = document.createElement("tr");
		noeud_td1 = document.createElement("td");
		noeud_td2 = document.createElement("td");
		noeud_td3 = document.createElement("td");
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
		// Mise en place du noeud img td3
		noeud_img_div_td3 = document.createElement("img");
		noeud_img_div_td3.setAttribute('src', PATH+"/"+"images/actus/croix.png");
		noeud_img_div_td3.setAttribute('alt', PATH+"/supAmisCercle");
		noeud_div_td1.appendChild(noeud_img_div_td1);
		// Mise en place du td3
		noeud_a_td3 = document.createElement("a");
		noeud_a_td3.setAttribute('href', PATH+"/SupprimerAmiCercle?idAmis="+tab_id[i]+"&idCercle="+tab[3]);
		noeud_a_td3.appendChild(noeud_img_div_td3);
		noeud_td3.appendChild(noeud_a_td3);
		// On relie les 3 TD au TR
		noeud_tr.appendChild(noeud_td1);
		noeud_tr.appendChild(noeud_td2);
		noeud_tr.appendChild(noeud_td3);
		noeud_table.appendChild(noeud_tr);
	}
	document.getElementById("membres_cercle").appendChild(noeud_table);
	$(function(){
		$("#membres_cercle").dialog("open");
	});
	return(false);
}