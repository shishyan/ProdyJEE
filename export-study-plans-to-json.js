const fs = require('fs');

// Load the study plans data
const studyPlansData = require('./public/study-plans-data.js');

// Create the database export structure
const databaseExport = {
  studyPlans: studyPlansData,
  exportDate: new Date().toISOString(),
  version: '1.0',
  totalRecords: studyPlansData.length
};

// Write to public/database-export.json
fs.writeFileSync(
  './public/database-export.json',
  JSON.stringify(databaseExport, null, 2)
);

console.log('✅ Successfully exported study plans to database-export.json');
console.log(`📊 Total records: ${studyPlansData.length}`);
console.log(`📁 File location: public/database-export.json`);
