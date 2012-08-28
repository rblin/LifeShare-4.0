var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
var RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
var RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
var OWL = $rdf.Namespace("http://www.w3.org/2002/07/owl#");
var DC = $rdf.Namespace("http://purl.org/dc/elements/1.1/");
var RSS = $rdf.Namespace("http://purl.org/rss/1.0/");
var XSD = $rdf.Namespace("http://www.w3.org/TR/2004/REC-xmlschema-2-20041028/#dt-");
var CONTACT = $rdf.Namespace("http://www.w3.org/2000/10/swap/pim/contact#");

/**
 * Cette fonction charge la liste des FOAF:knows d'une personne
 * @param profiles : Tableau d'amis
 */
function load_friends(profiles){
	
	var store = new $rdf.IndexedFormula(); // graphs store

	/**
	 * Callback appelé lors de la ocnstatation d'un succès sur un appel ajax de cette fonction.
	 * @param data : donnée au format N3/turtle, rdf ou rdfa
	 * @param xhr : xmlHttpRequest
	 */
	function load_profile(data, xhr){
		var uri = xhr.url.split("=")[1];
		var docURI = xhr.url; // http://bblfish.net/foaf.ttl
		var profile = $rdf.sym(xhr.uri);
		$rdf.parse(data, store, docURI, 'text/n3'); // Parse N3 data
		
		var icon_uri = store.any(profile, FOAF('img'));
		if(!icon_uri) icon_uri = store.any(profile, FOAF('depiction'));
		
		$('#friends_list').append(
				'<div class="contact_chat">'+
					'<a class="align_photo_chat" href="/explorateurMurAmis?idAmis=128">'+
						'<img src="' + store.any(profile, FOAF('depiction')).value + '" alt="Anne-K Chaussette" />' +
					'</a>' +
					'<a class="align_photo_chat" href="'+ uri +'"> '+
						store.any(profile, FOAF('name')) +
					'</a>'+
					'<br />'+
				'</div>'
		);

	}

	for(var i=0 ;  i < profiles.length ; i++){
		if(profiles[i]) {
			jQuery.ajax({
				url: "http://data.fm/proxy?uri="+profiles[i].value,
				uri: profiles[i].value,
				accepts: {'*': 'text/n3'},
				async : true,
				success : function(data){
					load_profile(data, this);
				}
			});
		}
	}
}

function wall_loader(uri){
	var xhr = {};
	var store = new $rdf.IndexedFormula();
	var docURI = uri.slice(0, uri.indexOf('#'));
	var person = $rdf.sym(uri);
	var graph = $rdf.sym(docURI);

	/**
	 * Callback servant à afficher le profil d'une personne.
	 * @param data : donnée rdf
	 * @param xhr : xmlHttpRequest
	 */
	function show_profile(data, xhr){
		$rdf.parse(data, store, docURI, 'text/n3'); // Parse N3 data
		var friends = store.each(person, FOAF('knows'), undefined, graph);
		var icon_uri = store.any(person, FOAF('img'), undefined, graph);
		

		if(icon_uri == undefined){
			icon_uri = store.any(person, FOAF('depiction'));
		}
		
		if(icon_uri != undefined){
			var n = friends.length;
			$('#friends').html("Friends (" + n + ")");
			$('#profile_photo').html('<img src="' + icon_uri.value + '" alt="profil" />');
		}
		load_friends(friends);
	}
	
	xhr = jQuery.ajax({
		url: "http://data.fm/proxy?uri="+uri,
		accepts: {'*': 'text/n3'},
		async : true,
		success : function(data){
			show_profile(data, xhr);
		}
	});
}

