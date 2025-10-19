const fs = require('fs');

// JEE Class 11 Physics Data
const physicsData = [
  { unique_id: 'JEE-11-PHY-1.1', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-1', chapter_name: 'Physical World and Measurement', topic_id: 'PHY-1.1', topic: 'Units and dimensions', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-1.2', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-1', chapter_name: 'Physical World and Measurement', topic_id: 'PHY-1.2', topic: 'Significant figures and error analysis', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-2.1', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-2', chapter_name: 'Kinematics', topic_id: 'PHY-2.1', topic: 'Motion in a straight line', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-2.2', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-2', chapter_name: 'Kinematics', topic_id: 'PHY-2.2', topic: 'Projectile motion and vector analysis', target_date: '', learning_status: 'Done', learning_stage: 'Revised', proficiency_percentage: 100, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-3.1', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-3', chapter_name: 'Laws of Motion', topic_id: 'PHY-3.1', topic: 'Newton\'s laws and applications', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-3.2', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-3', chapter_name: 'Laws of Motion', topic_id: 'PHY-3.2', topic: 'Friction and circular motion', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-4.1', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-4', chapter_name: 'Work, Energy and Power', topic_id: 'PHY-4.1', topic: 'Work-energy theorem and conservation laws', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-4.2', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-4', chapter_name: 'Work, Energy and Power', topic_id: 'PHY-4.2', topic: 'Power and efficiency', target_date: '', learning_status: 'Done', learning_stage: 'Revised', proficiency_percentage: 100, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-5.1', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-5', chapter_name: 'Rotational Motion', topic_id: 'PHY-5.1', topic: 'Torque, angular momentum, moment of inertia', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-6.1', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-6', chapter_name: 'Gravitation', topic_id: 'PHY-6.1', topic: 'Law of gravitation, escape velocity, orbital motion', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-7.1', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-7', chapter_name: 'Properties of Solids and Fluids', topic_id: 'PHY-7.1', topic: 'Stress-strain, Pascal\'s law, buoyancy, viscosity', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-8.1', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-8', chapter_name: 'Thermodynamics', topic_id: 'PHY-8.1', topic: 'Heat, temperature, laws of thermodynamics', target_date: '', learning_status: 'Done', learning_stage: 'Revised', proficiency_percentage: 100, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-9.1', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-9', chapter_name: 'Kinetic Theory of Gases', topic_id: 'PHY-9.1', topic: 'Ideal gas equation, pressure, mean free path', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-PHY-10.1', curriculum: 'JEE', grade: '11', subject: 'Physics', chapter_id: 'PHY-10', chapter_name: 'Oscillations and Waves', topic_id: 'PHY-10.1', topic: 'SHM, resonance, wave motion, sound waves', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' }
];

// JEE Class 11 Chemistry Data
const chemistryData = [
  { unique_id: 'JEE-11-CHM-1.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-1', chapter_name: 'Some Basic Concepts of Chemistry', topic_id: 'CHM-1.1', topic: 'Mole concept and stoichiometry', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-1.2', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-1', chapter_name: 'Some Basic Concepts of Chemistry', topic_id: 'CHM-1.2', topic: 'Laws of chemical combination', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-2.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-2', chapter_name: 'Structure of Atom', topic_id: 'CHM-2.1', topic: 'Bohr\'s model and quantum mechanical model', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-2.2', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-2', chapter_name: 'Structure of Atom', topic_id: 'CHM-2.2', topic: 'Quantum numbers and orbitals', target_date: '', learning_status: 'Done', learning_stage: 'Revised', proficiency_percentage: 100, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-3.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-3', chapter_name: 'Periodic Table', topic_id: 'CHM-3.1', topic: 'Modern periodic law and periodic trends', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-4.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-4', chapter_name: 'Chemical Bonding', topic_id: 'CHM-4.1', topic: 'Ionic and covalent bonding, VSEPR theory', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-4.2', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-4', chapter_name: 'Chemical Bonding', topic_id: 'CHM-4.2', topic: 'Hybridization and molecular orbital theory', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-5.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-5', chapter_name: 'States of Matter', topic_id: 'CHM-5.1', topic: 'Gas laws and kinetic theory', target_date: '', learning_status: 'Done', learning_stage: 'Revised', proficiency_percentage: 100, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-6.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-6', chapter_name: 'Thermodynamics', topic_id: 'CHM-6.1', topic: 'Enthalpy, entropy, Gibbs free energy', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-7.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-7', chapter_name: 'Equilibrium', topic_id: 'CHM-7.1', topic: 'Chemical equilibrium and Le Chatelier\'s principle', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-7.2', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-7', chapter_name: 'Equilibrium', topic_id: 'CHM-7.2', topic: 'Ionic equilibrium, pH, solubility product', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-8.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-8', chapter_name: 'Redox Reactions', topic_id: 'CHM-8.1', topic: 'Oxidation number and redox balancing', target_date: '', learning_status: 'Done', learning_stage: 'Revised', proficiency_percentage: 100, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-9.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-9', chapter_name: 'Hydrogen', topic_id: 'CHM-9.1', topic: 'Properties, hydrides, heavy water', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-10.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-10', chapter_name: 'The s-Block Element', topic_id: 'CHM-10.1', topic: 'Alkali and alkaline earth metals', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-11.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-11', chapter_name: 'The p-Block Element', topic_id: 'CHM-11.1', topic: 'Group 13 and 14 elements: properties and trends', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-12.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-12', chapter_name: 'Organic Chemistry – Basic Principles', topic_id: 'CHM-12.1', topic: 'Nomenclature, electronic effects, reaction types', target_date: '', learning_status: 'Done', learning_stage: 'Revised', proficiency_percentage: 100, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-13.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-13', chapter_name: 'Hydrocarbons', topic_id: 'CHM-13.1', topic: 'Alkanes, alkenes, alkynes, benzene reactions', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-CHM-14.1', curriculum: 'JEE', grade: '11', subject: 'Chemistry', chapter_id: 'CHM-14', chapter_name: 'Environmental Chemistry', topic_id: 'CHM-14.1', topic: 'Air, water, soil pollution and green chemistry', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' }
];

// JEE Class 11 Mathematics Data
const mathematicsData = [
  { unique_id: 'JEE-11-MTH-1.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-1', chapter_name: 'Sets', topic_id: 'MTH-1.1', topic: 'Types of sets and operations', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-2.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-2', chapter_name: 'Relations and Functions', topic_id: 'MTH-2.1', topic: 'Cartesian product, domain, range', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-3.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-3', chapter_name: 'Trigonometric Functions', topic_id: 'MTH-3.1', topic: 'Identities, equations, graphs', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-4.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-4', chapter_name: 'Complex Numbers', topic_id: 'MTH-4.1', topic: 'Algebra and polar form', target_date: '', learning_status: 'Done', learning_stage: 'Revised', proficiency_percentage: 100, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-5.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-5', chapter_name: 'Linear Inequalities', topic_id: 'MTH-5.1', topic: 'One and two variable cases', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-6.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-6', chapter_name: 'Permutations and Combinations', topic_id: 'MTH-6.1', topic: 'Counting principles and factorials', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-7.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-7', chapter_name: 'Binomial Theorem', topic_id: 'MTH-7.1', topic: 'Expansion, general term, middle term', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-8.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-8', chapter_name: 'Sequences and Series', topic_id: 'MTH-8.1', topic: 'AP, GP, special series', target_date: '', learning_status: 'Done', learning_stage: 'Revised', proficiency_percentage: 100, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-9.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-9', chapter_name: 'Straight Lines', topic_id: 'MTH-9.1', topic: 'Slope, intercept, distance formula', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-10.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-10', chapter_name: 'Conic Sections', topic_id: 'MTH-10.1', topic: 'Circle, parabola, ellipse, hyperbola', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-11.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-11', chapter_name: 'Introduction to 3D Geometry', topic_id: 'MTH-11.1', topic: 'Coordinates, distance, section formula', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-12.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-12', chapter_name: 'Limits and Derivatives', topic_id: 'MTH-12.1', topic: 'First principles, standard derivatives', target_date: '', learning_status: 'Done', learning_stage: 'Revised', proficiency_percentage: 100, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-13.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-13', chapter_name: 'Mathematical Reasoning', topic_id: 'MTH-13.1', topic: 'Statements, truth values, implications', target_date: '', learning_status: 'In Queue', learning_stage: 'Skimmed', proficiency_percentage: 25, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-14.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-14', chapter_name: 'Statistics', topic_id: 'MTH-14.1', topic: 'Mean, variance, standard deviation', target_date: '', learning_status: 'To Do', learning_stage: 'Grasped', proficiency_percentage: 50, progress_percentage: 0, notes: '' },
  { unique_id: 'JEE-11-MTH-15.1', curriculum: 'JEE', grade: '11', subject: 'Mathematics', chapter_id: 'MTH-15', chapter_name: 'Probability', topic_id: 'MTH-15.1', topic: 'Basic concepts, types of events', target_date: '', learning_status: 'In Progress', learning_stage: 'Practiced', proficiency_percentage: 75, progress_percentage: 0, notes: '' }
];

// Combine all data
const allData = [...physicsData, ...chemistryData, ...mathematicsData];

// Load existing study plans
let existingData = [];
try {
  if (fs.existsSync('public/study-plans-data.js')) {
    const fileContent = fs.readFileSync('public/study-plans-data.js', 'utf8');
    const match = fileContent.match(/const studyPlansData = (\[[\s\S]*\]);/);
    if (match) {
      existingData = JSON.parse(match[1]);
    }
  }
} catch (error) {
  console.log('No existing data found, starting fresh');
}

// Merge with existing data (avoid duplicates)
const existingIds = new Set(existingData.map(item => item.unique_id));
const newData = allData.filter(item => !existingIds.has(item.unique_id));
const mergedData = [...existingData, ...newData];

// Write to file
const fileContent = `const studyPlansData = ${JSON.stringify(mergedData, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = studyPlansData;
}
`;

fs.writeFileSync('public/study-plans-data.js', fileContent);

// Also update localStorage via a simple script
console.log('✅ Successfully added JEE Class 11 data!');
console.log(`📊 Total records: ${mergedData.length}`);
console.log(`📝 New records added: ${newData.length}`);
console.log('\n📚 Summary by subject:');
console.log(`   Physics: ${allData.filter(d => d.subject === 'Physics').length} topics`);
console.log(`   Chemistry: ${allData.filter(d => d.subject === 'Chemistry').length} topics`);
console.log(`   Mathematics: ${allData.filter(d => d.subject === 'Mathematics').length} topics`);
console.log('\n🎯 Data saved to: public/study-plans-data.js');
console.log('💡 Reload your app to see the new data!');
