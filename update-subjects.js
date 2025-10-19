const fs = require('fs');

// Read the current database
const dbPath = './public/database-export.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Extract unique subjects from studyPlans
const uniqueSubjects = [...new Set(db.studyPlans.map(item => item.subject))];
uniqueSubjects.sort();

db.subjects = uniqueSubjects;

// Count unique chapters
const uniqueChapters = new Set();
db.studyPlans.forEach(item => {
  uniqueChapters.add(`${item.subject}-${item.chapter_id}`);
});
db.totalChapters = uniqueChapters.size;

// Update timestamp
db.exportedAt = new Date().toISOString();

// Write back to file
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`✅ Updated subjects: ${db.subjects.join(', ')}`);
console.log(`📚 Total chapters: ${db.totalChapters}`);
console.log(`📊 Total records: ${db.totalRecords}`);
