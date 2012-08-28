var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/");
var SIOC = $rdf.Namespace("http://rdfs.org/sioc/ns#");

var kb = $rdf.graph();


/**
 * This function return the response of HTTP GET on RWW server.
 * @param uri : adress of source
 * @returns {String} The content of this resource
 */
function HTTP_GET(uri){
	var result = null;
	$.ajax({
		type: "GET",
		accepts: "text/turtle",
		url: uri,
		async: false,
		success: function(data){
			result = data;
		}
	});
	return result;
}

/**
 * This function make a HTTP-DELETE on RWW.
 * @param uri : adress of resource
 */
function HTTP_DELETE(uri){
	$.ajax({
		type: "DELETE",
		url: uri
	});
}

/**
 * This function make a HTTP-PUT on RWW.
 * @param uri : adress of source
 * @param data : data to send
 */
function HTTP_PUT(uri, dataToTransmit){
	$.ajax({
		type: "PUT",
		contentType: "text/turtle",
		url: uri,
		data: dataToTransmit,
	});
}