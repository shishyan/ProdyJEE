const fs = require('fs');
const data = fs.readFileSync('study-plans-data.js', 'utf8');
const studyPlans = eval(data.replace('module.exports = ', ''));

// Group by chapters
const chapters = {};
studyPlans.forEach(plan => {
  const key = plan.chapter_id + '-' + plan.chapter_name;
  if (!chapters[key]) {
    chapters[key] = {
      chapter_id: plan.chapter_id,
      chapter_name: plan.chapter_name,
      subject: plan.subject,
      topics: []
    };
  }
  chapters[key].topics.push(plan.topic);
});

console.log('Total chapters:', Object.keys(chapters).length);
console.log('Chapters by subject:');
const bySubject = {};
Object.values(chapters).forEach(ch => {
  if (!bySubject[ch.subject]) bySubject[ch.subject] = 0;
  bySubject[ch.subject]++;
});
console.log(bySubject);

console.log('\nSample chapters:');
Object.values(chapters).slice(0, 5).forEach(ch => {
  console.log(ch.subject + ' - ' + ch.chapter_name + ': ' + ch.topics.length + ' topics');
});
