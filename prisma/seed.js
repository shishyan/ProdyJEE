const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Seed Subjects
  const subjectNames = ['Mathematics', 'Physics', 'Chemistry']
  for (const name of subjectNames) {
    await prisma.subjects.upsert({
      where: { subject_id: subjectNames.indexOf(name) + 1 },
      update: {},
      create: { name }
    })
  }

  // Seed Chapters
  const subjects = await prisma.subjects.findMany()
  const math = subjects.find(s=>s.name==='Mathematics')
  const phys = subjects.find(s=>s.name==='Physics')
  const chem = subjects.find(s=>s.name==='Chemistry')

  const chaptersData = [
    // Mathematics
    { subject_id: math.subject_id, name: 'Sets', unit: 'Sets and Functions', cbse_weightage:5, jee_weightage:3 },
    { subject_id: math.subject_id, name: 'Relations and Functions', unit: 'Sets and Functions', cbse_weightage:6, jee_weightage:6 },
    { subject_id: math.subject_id, name: 'Trigonometric Functions', unit: 'Sets and Functions', cbse_weightage:7, jee_weightage:8 },
    { subject_id: math.subject_id, name: 'Principle of Mathematical Induction', unit: 'Algebra', cbse_weightage:4, jee_weightage:2 },
    { subject_id: math.subject_id, name: 'Complex Numbers and Quadratic Equations', unit: 'Algebra', cbse_weightage:8, jee_weightage:9 },
    { subject_id: math.subject_id, name: 'Linear Inequalities', unit: 'Algebra', cbse_weightage:5, jee_weightage:4 },
    { subject_id: math.subject_id, name: 'Permutations and Combinations', unit: 'Algebra', cbse_weightage:6, jee_weightage:8 },
    { subject_id: math.subject_id, name: 'Binomial Theorem', unit: 'Algebra', cbse_weightage:6, jee_weightage:7 },
    { subject_id: math.subject_id, name: 'Sequences and Series', unit: 'Algebra', cbse_weightage:7, jee_weightage:8 },
    { subject_id: math.subject_id, name: 'Straight Lines', unit: 'Coordinate Geometry', cbse_weightage:6, jee_weightage:7 },
    { subject_id: math.subject_id, name: 'Conic Sections', unit: 'Coordinate Geometry', cbse_weightage:6, jee_weightage:7 },
    { subject_id: math.subject_id, name: 'Introduction to Three-Dimensional Geometry', unit: 'Coordinate Geometry', cbse_weightage:5, jee_weightage:6 },
    { subject_id: math.subject_id, name: 'Limits and Derivatives', unit: 'Calculus', cbse_weightage:8, jee_weightage:9 },
    { subject_id: math.subject_id, name: 'Mathematical Reasoning', unit: 'Mathematical Reasoning', cbse_weightage:4, jee_weightage:3 },
    { subject_id: math.subject_id, name: 'Statistics', unit: 'Statistics and Probability', cbse_weightage:6, jee_weightage:4 },
    { subject_id: math.subject_id, name: 'Probability', unit: 'Statistics and Probability', cbse_weightage:7, jee_weightage:6 },
    { subject_id: math.subject_id, name: 'Practical Mathematics', unit: 'Applied Math', cbse_weightage:3, jee_weightage:2 },
    { subject_id: math.subject_id, name: 'Revision and Integration', unit: 'Mixed Practice', cbse_weightage:10, jee_weightage:10 },
    // Physics
    { subject_id: phys.subject_id, name: 'Physical World', unit: 'Foundations', cbse_weightage:4, jee_weightage:2 },
    { subject_id: phys.subject_id, name: 'Units and Measurements', unit: 'Foundations', cbse_weightage:6, jee_weightage:7 },
    { subject_id: phys.subject_id, name: 'Motion in a Straight Line', unit: 'Mechanics', cbse_weightage:7, jee_weightage:8 },
    { subject_id: phys.subject_id, name: 'Motion in a Plane', unit: 'Mechanics', cbse_weightage:7, jee_weightage:8 },
    { subject_id: phys.subject_id, name: 'Laws of Motion', unit: 'Mechanics', cbse_weightage:8, jee_weightage:9 },
    { subject_id: phys.subject_id, name: 'Work, Energy and Power', unit: 'Mechanics', cbse_weightage:7, jee_weightage:8 },
    { subject_id: phys.subject_id, name: 'System of Particles and Rotational Motion', unit: 'Mechanics', cbse_weightage:7, jee_weightage:9 },
    { subject_id: phys.subject_id, name: 'Gravitation', unit: 'Mechanics', cbse_weightage:6, jee_weightage:8 },
    { subject_id: phys.subject_id, name: 'Mechanical Properties of Solids', unit: 'Properties of Matter', cbse_weightage:5, jee_weightage:6 },
    { subject_id: phys.subject_id, name: 'Mechanical Properties of Fluids', unit: 'Properties of Matter', cbse_weightage:6, jee_weightage:7 },
    { subject_id: phys.subject_id, name: 'Thermal Properties of Matter', unit: 'Thermodynamics', cbse_weightage:6, jee_weightage:7 },
    { subject_id: phys.subject_id, name: 'Thermodynamics', unit: 'Thermodynamics', cbse_weightage:8, jee_weightage:9 },
    { subject_id: phys.subject_id, name: 'Kinetic Theory', unit: 'Thermodynamics', cbse_weightage:5, jee_weightage:6 },
    { subject_id: phys.subject_id, name: 'Oscillations', unit: 'Waves and Oscillations', cbse_weightage:7, jee_weightage:8 },
    { subject_id: phys.subject_id, name: 'Waves', unit: 'Waves and Oscillations', cbse_weightage:7, jee_weightage:8 },
    // Chemistry
    { subject_id: chem.subject_id, name: 'Some Basic Concepts of Chemistry', unit: 'Foundations', cbse_weightage:7, jee_weightage:8 },
    { subject_id: chem.subject_id, name: 'Structure of Atom', unit: 'Atomic Structure', cbse_weightage:7, jee_weightage:9 },
    { subject_id: chem.subject_id, name: 'Classification of Elements and Periodicity', unit: 'Periodic Table', cbse_weightage:6, jee_weightage:7 },
    { subject_id: chem.subject_id, name: 'Chemical Bonding and Molecular Structure', unit: 'Bonding', cbse_weightage:8, jee_weightage:9 },
    { subject_id: chem.subject_id, name: 'States of Matter – Gases and Liquids', unit: 'Physical Chemistry', cbse_weightage:6, jee_weightage:7 },
    { subject_id: chem.subject_id, name: 'Thermodynamics', unit: 'Physical Chemistry', cbse_weightage:8, jee_weightage:9 },
    { subject_id: chem.subject_id, name: 'Equilibrium', unit: 'Physical Chemistry', cbse_weightage:7, jee_weightage:9 },
    { subject_id: chem.subject_id, name: 'Redox Reactions', unit: 'Physical Chemistry', cbse_weightage:6, jee_weightage:8 },
    { subject_id: chem.subject_id, name: 'Hydrogen', unit: 'Inorganic Chemistry', cbse_weightage:5, jee_weightage:6 },
    { subject_id: chem.subject_id, name: 'The s-Block Element', unit: 'Inorganic Chemistry', cbse_weightage:6, jee_weightage:7 },
    { subject_id: chem.subject_id, name: 'The p-Block Element', unit: 'Inorganic Chemistry', cbse_weightage:6, jee_weightage:7 },
    { subject_id: chem.subject_id, name: 'Organic Chemistry – Basic Principles', unit: 'Organic Chemistry', cbse_weightage:7, jee_weightage:9 },
    { subject_id: chem.subject_id, name: 'Hydrocarbons', unit: 'Organic Chemistry', cbse_weightage:7, jee_weightage:9 },
    { subject_id: chem.subject_id, name: 'Environmental Chemistry', unit: 'Applied Chemistry', cbse_weightage:5, jee_weightage:4 },
    { subject_id: chem.subject_id, name: 'Practical Chemistry', unit: 'Lab Work', cbse_weightage:5, jee_weightage:3 }
  ]

  for (const ch of chaptersData) {
    await prisma.chapters.create({ data: ch })
  }

  // Get chapter IDs
  const chapters = await prisma.chapters.findMany()
  const getChapterId = (subjectName, chapterName) => {
    const subjectId = subjectNames.indexOf(subjectName) + 1
    return chapters.find(c => c.subject_id === subjectId && c.name === chapterName)?.chapter_id
  }

  // Seed SubTopics for Mathematics (first 25)
  const mathSubtopics = [
    { chapter_id: getChapterId('Mathematics', 'Sets'), name: 'Types of sets', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: false },
    { chapter_id: getChapterId('Mathematics', 'Sets'), name: 'Venn diagrams', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: false },
    { chapter_id: getChapterId('Mathematics', 'Sets'), name: 'Operations on sets', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Sets'), name: 'Complement and properties', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Relations and Functions'), name: 'Cartesian product of sets', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Relations and Functions'), name: 'Relations and types', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Relations and Functions'), name: 'Functions and types', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Relations and Functions'), name: 'Domain, range, and graphs', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Trigonometric Functions'), name: 'Radian and degree measure', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Trigonometric Functions'), name: 'Trigonometric identities', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Trigonometric Functions'), name: 'Graphs of trigonometric functions', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Trigonometric Functions'), name: 'General solutions of equations', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Trigonometric Functions'), name: 'Trigonometric equations', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Principle of Mathematical Induction'), name: 'Process of induction', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Principle of Mathematical Induction'), name: 'Applications of induction', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Complex Numbers and Quadratic Equations'), name: 'Algebra of complex numbers', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Complex Numbers and Quadratic Equations'), name: 'Polar form of complex numbers', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Complex Numbers and Quadratic Equations'), name: 'Quadratic equations and roots', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Complex Numbers and Quadratic Equations'), name: 'Fundamental theorem of algebra', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Linear Inequalities'), name: 'Linear inequalities in one variable', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Linear Inequalities'), name: 'Linear inequalities in two variables', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Linear Inequalities'), name: 'Graphical solutions', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Permutations and Combinations'), name: 'Fundamental principle of counting', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Permutations and Combinations'), name: 'Factorial notation and properties', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Mathematics', 'Permutations and Combinations'), name: 'Permutations and combinations', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true }
  ]

  // Physics SubTopics (first 25)
  const physicsSubtopics = [
    { chapter_id: getChapterId('Physics', 'Physical World'), name: 'Scope and excitement of physics', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: false },
    { chapter_id: getChapterId('Physics', 'Physical World'), name: 'Physics in relation to other sciences', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: false },
    { chapter_id: getChapterId('Physics', 'Physical World'), name: 'Nature of physical laws', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: false },
    { chapter_id: getChapterId('Physics', 'Units and Measurements'), name: 'SI units and dimensional analysis', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Units and Measurements'), name: 'Measurement of length, mass, time', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Units and Measurements'), name: 'Accuracy, precision, errors', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Units and Measurements'), name: 'Significant figures and rounding off', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Motion in a Straight Line'), name: 'Position, path length, displacement', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Motion in a Straight Line'), name: 'Average and instantaneous velocity', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Motion in a Straight Line'), name: 'Speed and velocity graphs', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Motion in a Straight Line'), name: 'Acceleration and its graphs', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Motion in a Straight Line'), name: 'Equations of motion', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Motion in a Plane'), name: 'Vectors and scalars', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Motion in a Plane'), name: 'Vector addition and subtraction', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Motion in a Plane'), name: 'Multiplication of vectors', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Motion in a Plane'), name: 'Projectile motion', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Motion in a Plane'), name: 'Uniform circular motion', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Laws of Motion'), name: 'Newton’s laws of motion', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Laws of Motion'), name: 'Inertia and mass', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Laws of Motion'), name: 'Force and types of forces', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Laws of Motion'), name: 'Friction and contact forces', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Laws of Motion'), name: 'Free body diagrams', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Laws of Motion'), name: 'Circular motion and banking', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Laws of Motion'), name: 'Conservation of momentum', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Physics', 'Laws of Motion'), name: 'Impulse and collisions', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true }
  ]

  // Chemistry SubTopics (first 25)
  const chemistrySubtopics = [
    { chapter_id: getChapterId('Chemistry', 'Some Basic Concepts of Chemistry'), name: 'Importance of chemistry and nature of matter', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: false },
    { chapter_id: getChapterId('Chemistry', 'Some Basic Concepts of Chemistry'), name: 'Laws of chemical combination', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Some Basic Concepts of Chemistry'), name: 'Dalton’s atomic theory', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Some Basic Concepts of Chemistry'), name: 'Mole concept and molar mass', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Some Basic Concepts of Chemistry'), name: 'Stoichiometry and limiting reagent', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Structure of Atom'), name: 'Subatomic particles and discovery of electron/proton', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Structure of Atom'), name: 'Thomson and Rutherford models', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Structure of Atom'), name: 'Bohr’s model and postulates', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Structure of Atom'), name: 'Dual nature of matter and de Broglie equation', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Structure of Atom'), name: 'Quantum numbers and orbitals', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Classification of Elements and Periodicity'), name: 'Modern periodic law and table', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Classification of Elements and Periodicity'), name: 'Periodic trends in properties', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Classification of Elements and Periodicity'), name: 'Ionization enthalpy and electron gain enthalpy', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Classification of Elements and Periodicity'), name: 'Electronegativity and valency', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Chemical Bonding and Molecular Structure'), name: 'Kossel-Lewis approach and ionic bond', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Chemical Bonding and Molecular Structure'), name: 'Covalent bond and Lewis structures', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Chemical Bonding and Molecular Structure'), name: 'Bond parameters and polarity', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Chemical Bonding and Molecular Structure'), name: 'VSEPR theory and shapes of molecules', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'Chemical Bonding and Molecular Structure'), name: 'Hybridization and molecular orbital theory', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'States of Matter – Gases and Liquids'), name: 'Intermolecular forces and gas laws', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'States of Matter – Gases and Liquids'), name: 'Ideal gas equation and deviations', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'States of Matter – Gases and Liquids'), name: 'Kinetic molecular theory of gases', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'States of Matter – Gases and Liquids'), name: 'Liquefaction and critical temperature', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'States of Matter – Gases and Liquids'), name: 'Properties of liquids and surface tension', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true },
    { chapter_id: getChapterId('Chemistry', 'States of Matter – Gases and Liquids'), name: 'Viscosity and vapor pressure', status: 'Not Started', time_spent_minutes: 0, mastery_level: 0, is_high_priority: true }
  ]

  // Insert all SubTopics
  const allSubtopics = [...mathSubtopics, ...physicsSubtopics, ...chemistrySubtopics]
  for (const st of allSubtopics) {
    if (st.chapter_id) {
      await prisma.subTopics.create({ data: st })
    }
  }

  // Seed Plans, Buckets, Tasks for Planner-like features
  const plan = await prisma.plans.create({
    data: {
      name: 'JEE Preparation Plan',
      description: 'Master Class 11 Mathematics, Physics, and Chemistry'
    }
  })

  const buckets = await Promise.all([
    prisma.buckets.create({ data: { plan_id: plan.plan_id, name: 'Backlog', order: 0 } }),
    prisma.buckets.create({ data: { plan_id: plan.plan_id, name: 'To Do', order: 1 } }),
    prisma.buckets.create({ data: { plan_id: plan.plan_id, name: 'In Progress', order: 2 } }),
    prisma.buckets.create({ data: { plan_id: plan.plan_id, name: 'Done', order: 3 } }),
    prisma.buckets.create({ data: { plan_id: plan.plan_id, name: 'Revision', order: 4 } })
  ])

  // Create backlog tasks from all subtopics organized by chapter
  const backlogSubtopics = await prisma.subTopics.findMany({
    include: {
      Chapters: {
        include: { Subjects: true }
      }
    },
    orderBy: [
      { Chapters: { subject_id: 'asc' } },
      { Chapters: { chapter_id: 'asc' } },
      { subtopic_id: 'asc' }
    ]
  })

  let order = 0
  for (const st of backlogSubtopics) {
    await prisma.tasks.create({
      data: {
        bucket_id: buckets[0].bucket_id, // Backlog bucket
        title: `${st.Chapters.Subjects.name} - ${st.Chapters.name} - ${st.name}`,
        description: `Study ${st.name} from Chapter ${st.Chapters.chapter_number}: ${st.Chapters.name}`,
        due_date: new Date(Date.now() + (order + 1) * 7 * 24 * 60 * 60 * 1000), // Spread out over weeks
        priority: st.is_high_priority ? 'High' : 'Medium',
        progress: st.status === 'Done' ? 100 : st.status === 'In Progress' ? 50 : 0,
        order: order++
      }
    })
  }

  // Create sample tasks in other buckets based on subtopics
  const sampleSubtopics = await prisma.subTopics.findMany({
    take: 8,
    include: {
      Chapters: {
        include: { Subjects: true }
      }
    },
    where: { status: { not: 'Done' } }
  })
  for (let i = 0; i < sampleSubtopics.length; i++) {
    const st = sampleSubtopics[i]
    const bucketIndex = (i % 3) + 1 // Skip backlog, use To Do, In Progress, Done
    const bucket = buckets[bucketIndex]
    const maxOrder = bucket.Tasks?.length || 0
    await prisma.tasks.create({
      data: {
        bucket_id: bucket.bucket_id,
        title: `${st.Chapters.Subjects.name} - ${st.Chapters.name} - ${st.name}`,
        description: `Study ${st.name} from Chapter ${st.Chapters.chapter_number}: ${st.Chapters.name}`,
        due_date: new Date(Date.now() + (i + 1) * 3 * 24 * 60 * 60 * 1000), // 3-24 days from now
        priority: st.is_high_priority ? 'High' : 'Medium',
        progress: bucket.name === 'Done' ? 100 : bucket.name === 'In Progress' ? Math.floor(Math.random() * 80) + 20 : 0,
        order: maxOrder
      }
    })
  }

  // Create sample labels
  const labels = await Promise.all([
    prisma.labels.create({ data: { name: 'Math', color: '#ff6b6b' } }),
    prisma.labels.create({ data: { name: 'Physics', color: '#4ecdc4' } }),
    prisma.labels.create({ data: { name: 'Chemistry', color: '#45b7d1' } }),
    prisma.labels.create({ data: { name: 'High Priority', color: '#f9ca24' } })
  ])

  // Assign labels to tasks
  const tasks = await prisma.tasks.findMany()
  for (const task of tasks) {
    const label = labels[Math.floor(Math.random() * labels.length)]
    await prisma.taskLabels.create({
      data: { task_id: task.task_id, label_id: label.label_id }
    })
  }

  console.log('Seeded all data successfully')
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
