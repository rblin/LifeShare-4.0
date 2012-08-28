var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
var RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
var RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
var OWL = $rdf.Namespace("http://www.w3.org/2002/07/owl#");
var DC = $rdf.Namespace("http://purl.org/dc/elements/1.1/");
var RSS = $rdf.Namespace("http://purl.org/rss/1.0/");
var XSD = $rdf.Namespace("http://www.w3.org/TR/2004/REC-xmlschema-2-20041028/#dt-");
var CONTACT = $rdf.Namespace("http://www.w3.org/2000/10/swap/pim/contact#");

function wall_loader(uri){
	$rdf.Fetcher.crossSiteProxyTemplate="http://data.fm/proxy?uri={uri}";
	load_foaf_profile("http://bblfish.net/people/henry/card#me");
};

/**
 * Cette fonction charge la liste des FOAF:knows d'une personne
 * @param profiles : Tableau d'amis
 */
function load_foaf_profile(profile_uri){
	var name;
	var avatar;
	var friends = [];
	var store = new $rdf.IndexedFormula();
	/**
	 * This function load all friend in the menu.
	 */
	function load_friends(){
		
		function load_friend(friend_uri){
			var profile = $rdf.sym(friend_uri);
			var docURI = friend_uri.slice(0, friend_uri.indexOf('#'));
			var fetch = $rdf.fetcher(store, undefined, true);
			
			fetch.nowOrWhenFetched($rdf.Fetcher.crossSiteProxy(docURI), undefined, function(){
				var profile_picture = store.any(profile, FOAF('img'));
				if(profile_picture == undefined){
					profile_picture = store.any(profile, FOAF('depiction'));
				}
				
				if(profile_picture != undefined){
					$('#friends_list').append(
						'<div class="contact_chat">'+
							'<a class="align_photo_chat" href="/explorateurMurAmis?idAmis=128">'+
								'<img src="' + store.any(profile, FOAF('depiction')).value + '" alt="'+ store.any(profile, FOAF('name')).value +'" />' +
							'</a>' +
							'<a class="align_photo_chat" href="'+ friend_uri +'"> '+
								store.any(profile, FOAF('name')) +
							'</a>'+
							'<br />'+
						'</div>'
					);
				}else{
					$('#friends_list').append(
							'<div class="contact_chat">'+
								'<a class="align_photo_chat" href="/explorateurMurAmis?idAmis=128">'+
									'<img src="banque-images/mini/mini-avatar-homme-defaut.png" alt="'+ store.any(profile, FOAF('name')).value +'" />' +
								'</a>' +
								'<a class="align_photo_chat" href="'+ friend_uri +'"> '+
									store.any(profile, FOAF('name')) +
								'</a>'+
								'<br />'+
							'</div>'
					);
				}
			});
		}
		
		for(var i=0 ; i < friends.length ; i++){
			load_friend(friends[i].uri);
		}
	}
	
	var docURI = profile_uri.slice(0, profile_uri.indexOf('#'));
	var person = $rdf.sym(profile_uri);
    var fetch = $rdf.fetcher(store, undefined, true);
    var graph = $rdf.sym(docURI);
	fetch.nowOrWhenFetched(docURI, undefined, function(){
		name = store.any(person, FOAF('name'));
		avatar = store.any(person, FOAF('depiction'));
		friends = store.each(person, FOAF('knows'), undefined, graph);
		$('#foaf_name').append(name.value);
		$('#profile_photo').append('<img src="' + avatar.uri + '" alt="'+ name +'" />');
		load_friends();
	});
}

