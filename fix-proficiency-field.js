// Fix proficiency field name in database-export.json
const fs = require('fs');

// Read the database file
const dbPath = './public/database-export.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Map proficiency percentage to proficiency name
const proficiencyMap = {
  25: 'Novice',
  50: 'Competent',
  75: 'Expert',
  100: 'Master'
};

// Update each study plan
data.studyPlans = data.studyPlans.map(plan => {
  // Convert proficiency_percentage to learning_proficiency
  if (plan.proficiency_percentage !== undefined) {
    plan.learning_proficiency = proficiencyMap[plan.proficiency_percentage] || 'Novice';
    delete plan.proficiency_percentage; // Remove old field
  }
  return plan;
});

// Write back to file
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
console.log('✅ Fixed proficiency field names in database-export.json');
console.log(`   Total records updated: ${data.studyPlans.length}`);
