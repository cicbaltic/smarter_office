var documents = module.exports = {
	views: {},
	lists: {}
}

documents.views.doc_by_time = {};
documents.views.doc_by_time['map'] = function(doc) {
	var zone_name = '';
	if (doc.hasOwnProperty('zone_name')){
    	zone_name = doc.zone_name;
	}

	emit([doc.time], {'_id': doc._id, 'time': doc.time, 'zone_id': doc.zone_id, 'zone_name' : zone_name, 'temp_v': doc.temp_v, 'hum_v': doc.hum_v });
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
	var newDate = new Date();

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
			//rows.push(row); 
			rows.push({
				'timestamp': row.value.time,
				'date': row.value.date,
				'zone_id': zoneId,
				'zone_name': row.value.zone_name,
				'temp_v': row.value.temp_v,
				'hum_v': row.value.hum_v,
				'id': row.value._id
			});
		} 
	} 
	send(JSON.stringify({'rows' : rows}));
}


documents.views.doc_by_zoneId = {};
documents.views.doc_by_zoneId['map'] = function(doc) {
	var zone_name = '';
	if (doc.hasOwnProperty('zone_name')){
    	zone_name = doc.zone_name;
	}

	emit([doc.zone_id], {'_id': doc._id, 'time': doc.time, 'zone_id': doc.zone_id, 'zone_name': zone_name, 'temp_v': doc.temp_v, 'hum_v': doc.hum_v });
}

documents.views.latest_doc_by_zone = {};
documents.views.latest_doc_by_zone['map'] = function(doc) {
	var zone_name = '';
	if (doc.hasOwnProperty('zone_name')){
    	zone_name = doc.zone_name;
	}

	emit([doc.zone_id], {'_id': doc._id, 'time': doc.time, 'zone_id': doc.zone_id, 'zone_name': zone_name, 'temp_v': doc.temp_v, 'hum_v': doc.hum_v });
}
documents.views.latest_doc_by_zone['reduce'] = function(key, values, rereduce){ 
	var time = 0;
	var tmp_data;
	values.forEach(function(data) {
		if(data.time > time) {
			time = data.time;
			tmp_data = data;
		}
	});
	return tmp_data;
}

documents.lists['latest_doc_by_zone'] = function (head, req) {
	var rows = [];
	var newDate = new Date();

	while (row = getRow()) { 

		row.value['date'] = new Date(row.value.time);
		var zoneId = row.value.zone_id;

		rows.push({
			'timestamp': row.value.time,
			'date': row.value.date,
			'zone_id': zoneId,
			'zone_name': row.value.zone_name,
			'temp_v': row.value.temp_v,
			'hum_v': row.value.hum_v,
			'id': row.value._id
		});
	} 
	send(JSON.stringify({'rows' : rows}));
}

//
documents.views.doc_by_zone_and_time_v1 = {};
documents.views.doc_by_zone_and_time_v1['map'] = function(doc){ 
//each 30 min
/*function roundTo30minutes(timestamp) {
	var date = new Date(timestamp);
	var minutes = date.getMinutes(); 
	var d = minutes % 30;
	date.setMinutes(minutes - d);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime()/1000;
}*/
//each hour
function roundToHour(timestamp) {
	var date = new Date(timestamp);
	var hours = date.getHours();
	var d = hours;
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime()/1000;
}

var timestamp = roundToHour(doc.time);

emit([doc.zone_id, timestamp], {'time_index': timestamp, 'time': doc.time, 'zone_id': doc.zone_id, 'temp_v': doc.temp_v, 'hum_v': doc.hum_v});
}
documents.views.doc_by_zone_and_time_v1['reduce'] = function(key, values, rereduce){ 

	var temp_v = 0,
	hum_v = 0,
	size = values.length,
	time_index = values[0]['time_index'];

	function roundToTwo(num) {    
    	return +(Math.round(num + "e+2")  + "e-2");
	}

	values.forEach(function(data) {
		temp_v += data.temp_v / size;
		hum_v += data.hum_v / size;
	});

	return {'time_index': time_index, 'temp_v': roundToTwo(temp_v), 'hum_v': roundToTwo(hum_v)};
}