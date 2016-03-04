var documents = module.exports = {
	views: {}
}

documents.views.all_entries = {};
documents.views.all_entries['map'] = function(doc){ 
	if(doc.zone_id) {
		emit([doc.zone_id], {'zone_name': doc.zone_name});
	}
}
documents.views.all_entries['reduce'] = function (keys, values, rereduce) {
  return values[0];
}