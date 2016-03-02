var documents = module.exports = {
	views: {}
	}

documents.views['allEntries'] = {};
documents.views.allEntries['map'] = function(doc){ 
	emit([doc.captureDateTime], [doc._id, doc.captureDateTime, doc.temperature]); 
}

