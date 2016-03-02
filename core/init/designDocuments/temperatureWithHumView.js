module.exports = function(doc){ 
	emit([doc.captureDateTime], [doc._id, doc.captureDateTime, doc.temperature]); 
}