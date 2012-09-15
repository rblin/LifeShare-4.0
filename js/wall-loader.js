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
	load_foaf_profile(uri);
};

/**
 * This function load the foaf profile of one person
 * @param profiles : Tableau d'amis
 */
function load_foaf_profile(profile_uri){
	var friends = [];
	var store = new $rdf.IndexedFormula();
	var docURI = profile_uri.slice(0, profile_uri.indexOf('#'));
	var person = $rdf.sym(profile_uri);
    var fetch = $rdf.fetcher(store, undefined, true);
    var graph = $rdf.sym($rdf.Fetcher.crossSiteProxy(docURI));
	/**
	 * This function load all friend in the left menu.
	 */
	function load_friends(){
		
		function load_friend(friend_uri){
			var profile = $rdf.sym(friend_uri);
			var docURI = friend_uri.slice(0, friend_uri.indexOf('#'));
			var fetch = $rdf.fetcher(store, undefined, true);

			/**
			 * This function display the foaf profile of the peron in the HTML5 DOM of the 
			 * profile.html page.
			 * @param friend_uri : uri of the friend
			 * @param foaf_name : store.any(person, FOAF('name'))
			 * @param foaf_gender : store.any(person, FOAF('gender'))
			 * @param foaf_depiction : store.any(person, FOAF('depiction'))
			 * @param foaf_img : store.any(person, FOAF('img'))
			 */
			function display_friend(friend_uri, foaf_name, foaf_gender, foaf_img, foaf_depiction){
				
				var uri ="";
				var name = "";
				var gender = "";
				var profile_picture = undefined;
				if(foaf_name) name = foaf_name.value;
				if(name == "") name = "no foaf:name";
				if(friend_uri) uri = encodeURIComponent(friend_uri);
				if(foaf_gender) gender = foaf_gender.value.toLowerCase();
				if(foaf_depiction) profile_picture = foaf_depiction.value;
				if(!profile_picture && foaf_img) profile_picture = foaf_img.value;
				
				if(!profile_picture && gender == "male"){
					profile_picture = "banque-images/mini/mini-avatar-homme-defaut.png";
				}else if(!profile_picture && gender == "female"){
					profile_picture = "banque-images/mini/mini-avatar-femme-defaut.png";
				}else if(!profile_picture){
					profile_picture = "banque-images/mini/mini-avatar-homme-defaut.png";
				}

				$('#friends_list').append(
					'<div class="contact_chat">'+
						'<a class="align_photo_chat" href="profile.html?uri=' + uri +'">'+
							'<img src="' + profile_picture + '" alt="'+ name +'" />' +
						'</a>' +
						'<a class="align_photo_chat" href="profile.html?uri=' + uri +'"> '+
							name +
						'</a>'+
						'<br />'+
					'</div>'
				);
				
				
			}
			
			
			fetch.nowOrWhenFetched(docURI, undefined, function(){
				display_friend(
						friend_uri,
						store.any(profile, FOAF('name')), 
						store.any(profile, FOAF('gender')), 
						store.any(profile, FOAF('img')), 
						store.any(profile, FOAF('depiction'))
					);
			});
		}
		
		for(var i=0 ; i < friends.length ; i++){
			load_friend(friends[i].uri);
		}
	}
	
	/**
	 * This function display the foaf profile of the peron in the HTML5 DOM of the 
	 * profile.html page.
	 * @param foaf_name : store.any(person, FOAF('name'))
	 * @param foaf_gender : store.any(person, FOAF('gender'))
	 * @param foaf_depiction : store.any(person, FOAF('depiction'))
	 * @param foaf_img : store.any(person, FOAF('img'))
	 */
	function display_profile(foaf_name, foaf_gender, foaf_depiction, foaf_img){
		var name = "";
		var profile_picture = undefined;
		
		if(foaf_name) name = foaf_name.value;
		if(foaf_gender) gender = foaf_gender.value.toLowerCase();
		if(foaf_depiction) profile_picture = foaf_depiction.value;
		if(!profile_picture && foaf_img) profile_picture = foaf_img.value;
		
		if(!profile_picture && gender == "male"){
			profile_picture = "banque-images/medium/medium-avatar-homme-defaut.png";
		}else if(!profile_picture && gender == "female"){
			profile_picture = "banque-images/medium/medium-avatar-femme-defaut.png";
		}else if(!profile_picture){
			profile_picture = "banque-images/medium/medium-avatar-homme-defaut.png";
		}
		
		$('#foaf_name').append(name);
		$('#profile_photo').append('<img src="' + profile_picture + '" alt="'+ name +'" />');
	}
	
	/**
	 * This function seralize the store into N3 format.
	 * @returns String
	 */
	function serialize_profile_store(document_uri){
		var sz = $rdf.Serializer(store);
		sz.suggestPrefix("foaf","http://xmlns.com/foaf/0.1/");
		var newSts = store.statementsMatching(undefined, undefined, undefined, $rdf.sym($rdf.Fetcher.crossSiteProxy(document_uri))).slice();
		return sz.statementsToN3(newSts);
	}

	fetch.nowOrWhenFetched(docURI, undefined, function(){
		
		display_profile(
				store.any(person, FOAF('name')),
				store.any(person, FOAF('gender')),
				store.any(person, FOAF('depiction')),
				store.any(person, FOAF('img'))
			);

		friends = store.each(person, FOAF('knows'), undefined, graph);
		load_friends();
	});

}



// NOT READY --- IN DEVELLOPEMENT
/**
 * This function load the sioc stream of one foaf profile.
 * @param sioc_stream_uri : uri of the sioc stream.
 */
function load_sioc_wall(sioc_stream_uri){
	var sioc_store = new $rdf.N3Parser.IndexedFormula(); // This is the quad store which store all quad line.
	
	/**
	 * This function load one comment of one status.
	 * @param comment_uri : uri of the comment
	 */
	function load_sioc_comment(comment_uri){
		var comment_file_uri = comment_uri.split("#")[0];
		//var sioc_comment = $rdf.sym(comment_uri);
		var sioc_comment_fetcher = $rdf.fetcher(sioc_store, undefined, true);
		sioc_comment_fetcher.nowOrWhenFetched($rdf.Fetcher.crossSiteProxy(comment_file_uri), undefined, function(){
			//var comment = sioc_store.any(sioc_comment, ""); // TODO SIOC Container
			
		});
	}
	
	/**
	 * This function load one status of sioc social stream.
	 * @param statut_uri : uri of the status.
	 */
	function load_sioc_status(statut_uri){
		
	}
	 
}
