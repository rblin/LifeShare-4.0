
function getXMLHttpRequest(){
	var objetXHR = null;
	try{
		objetXHR = new XMLHttpRequest();
	}catch(Error){
		objetXHR = new ActiveXObject("Msxml2.XMLHTTP");
	}
	return objetXHR;
}

function requeteAfficheAjoutAmis(ID_REF, PATH){
	var objetXHR = getXMLHttpRequest();
	objetXHR.onreadystatechange = function(){
		if(objetXHR.readyState == 4){ // La requete est termine
			if(objetXHR.status != 500 && objetXHR.status != 404){
				AfficheAjoutAmis(objetXHR.responseText, PATH);
			}else{
				alert("Erreur d'envoi au serveur.");
			}
		}
	};
	objetXHR.open("get", "AjoutAmis?id="+ID_REF, true);
	objetXHR.send(null);
	return(false);
}

function AfficheAjoutAmis(data, PATH){
	// On traite le XML Request afin de transformer les information en tableau
	var tab = data.split("|");
	var nomComplet = tab[0];
	var noeudTxt = document.createTextNode("Votre demande d'amis a bien été envoyé à ");
	var noeudLien = document.createElement("a");
	noeudLien.setAttribute("href", PATH+"/explorateurMurAmis?idAmis="+tab[1]);
	var noeudTxtLien = document.createTextNode(nomComplet);
	noeudLien.appendChild(noeudTxtLien);
	document.getElementById("ajout_amis").appendChild(noeudTxt);
	document.getElementById("ajout_amis").appendChild(noeudLien);
	$(function(){
		$("#ajout_amis").dialog("open");
	});
	var bouton = document.getElementById("bouton_ajout_amis_"+tab[1]);
	while(bouton.hasChildNodes()){
		bouton.removeChild(bouton.firstChild);
	}
	return(false);
}