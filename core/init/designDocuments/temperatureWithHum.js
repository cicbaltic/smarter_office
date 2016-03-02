var documents = module.exports = {
	views: {},
	lists: {}
}

documents.views['all_entries'] = {};
documents.views.all_entries['map'] = function(doc){ 
	//emit([doc.time], [doc._id, doc.time, doc.zone_id, doc.temp_v, doc.hum_v]); 
	emit([doc.time], {'_id': doc._id, 'time': doc.time, 'zone_id': doc.zone_id, 'temp_v': doc.temp_v, 'hum_v': doc.hum_v });
}

documents.lists['all_entries_with_step'] = function (head, req) {
	var interval = 10000; 
	if (req.query.interval) {
		interval = req.query.interval; 
	}

	var zones = {};
	var rows = [];
	var newDate = new Date();

	while (row = getRow()) { 
		row.value['date'] = new Date(row.value.time);
		var zoneId = row.value.zone_id;
		if(zones[zoneId] === undefined) {
			zones[zoneId] = row.value.time;
		}

		if (row.value.time - zones[zoneId] > interval) { 
			zones[zoneId] = row.value.time; 
			//rows.push(row); 
			rows.push({
				'timestamp': row.value.time,
				'date': row.value.date,
				'zone_id': zoneId,
				'temp_v': row.value.temp_v,
				'hum_v': row.value.hum_v,
				'id': row.value._id
			});
		} 
	} 
	send(JSON.stringify({'rows' : rows}));
}

