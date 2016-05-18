var documents = module.exports = {
	views: {},
	lists: {}
}

documents.views.doc_by_time = {};
documents.views.doc_by_time['map'] = function(doc){
	var zone_name = '';
	if (doc.hasOwnProperty('zone_name')){
    	zone_name = doc.zone_name;
	}

	emit([doc.time], {'_id': doc._id, 'time': doc.time, 'zone_id': doc.zone_id, 'zone_name': zone_name, 'temp_v': doc.temp_v, 'temp_u': doc.temp_u });
}

documents.views.doc_by_zoneId = {};
documents.views.doc_by_zoneId['map'] = function(doc){
	var zone_name = '';
	if (doc.hasOwnProperty('zone_name')){
    	zone_name = doc.zone_name;
	}

	emit([doc.zone_id], {'_id': doc._id, 'time': doc.time, 'zone_id': doc.zone_id, 'zone_name': zone_name, 'temp_v': doc.temp_v, 'temp_u': doc.temp_u });
}

documents.lists['doc_with_range'] = function (head, req) {
	var interval = 10000;
	if (req.query.interval) {
		interval = req.query.interval;
	}

	var zoneIds = false;
	if(req.query.zoneId) {
		zoneIds = req.query.zoneId.split(',');
	}

	var zones = {};

	var rows = [];
	while (row = getRow()) {
		if(zoneIds) {
			var exist = false;
			zoneIds.forEach(function(entry) {
				if(entry === row.value.zone_id) {
					exist = true;
				}
			});
			if(!exist) {
				continue;
			}
		}

		row.value['date'] = new Date(row.value.time);
		var zoneId = row.value.zone_id;
		if(zones[zoneId] === undefined) {
			zones[zoneId] = row.value.time;
		}

		if (row.value.time - zones[zoneId] > interval) {
			zones[zoneId] = row.value.time;
			rows.push({
				'timestamp': row.value.time,
				'date': row.value.date,
				'zone_id': zoneId,
				'zone_name': row.value.zone_name,
				'temp_v': row.value.temp_v,
				'temp_u': row.value.temp_u,
				'id': row.value._id
			});
		}
	}
	send(JSON.stringify({'rows' : rows}));
}


