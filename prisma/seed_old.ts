import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create a sample chapter
  const chapter = await prisma.chapter.create({
    data: {
      title: 'Class 10 Science - Life Processes',
      description:
        'Learn about the fundamental life processes that keep organisms alive including nutrition, respiration, and transportation.',
      subject: 'Science',
      classLevel: 'Class 10',
      order: 1,
    },
  })

  console.log(`Created chapter: ${chapter.title}`)

  // Create chapter content
  const topicsData = [
    {
      topic: 'Nutrition in Plants',
      content: `Plants prepare their own food through the process of photosynthesis. Photosynthesis is an anabolic process in which inorganic substances like carbon dioxide and water are converted into organic compounds like glucose in the presence of chlorophyll and light energy.

The process occurs in two stages:
1. Light-dependent reactions: Occurs in thylakoid membrane
2. Light-independent reactions (Calvin cycle): Occurs in the stroma`,
      order: 1,
    },
    {
      topic: 'Nutrition in Animals',
      content: `Animals cannot prepare their own food and are dependent on plants and other animals for their nutrition. This process involves ingestion, digestion, absorption, and egestion.

The digestive system includes:
- Mouth: Mechanical and chemical digestion begins
- Stomach: Churning and chemical digestion
- Small intestine: Maximum nutrient absorption
- Large intestine: Water absorption`,
      order: 2,
    },
    {
      topic: 'Respiration',
      content: `Respiration is the process of breaking down food molecules to release energy. It occurs in two forms:

Aerobic Respiration: Occurs in the presence of oxygen
C6H12O6 + 6O2 → 6CO2 + 6H2O + Energy

Anaerobic Respiration: Occurs in the absence of oxygen
C6H12O6 → 2C2H5OH + 2CO2 + Energy`,
      order: 3,
    },
    {
      topic: 'Transportation in Plants',
      content: `Water and minerals move from roots to shoots through xylem by the process of capillary action and transpiration pull.

Organic compounds (photosynthates) move from leaves to storage organs through phloem by the process called translocation. This movement is from source to sink.`,
      order: 4,
    },
  ]

  for (const topicData of topicsData) {
    await prisma.chapterContent.create({
      data: {
        ...topicData,
        chapterId: chapter.id,
      },
    })
  }

  console.log('Created chapter content topics')

  // Create 20+ MCQs
  const mcqsData = [
    {
      question: 'What is the main function of photosynthesis?',
      optionA: 'To break down glucose molecules',
      optionB: 'To convert light energy into chemical energy',
      optionC: 'To produce oxygen only',
      optionD: 'To absorb water from soil',
      correctOption: 'B',
      explanation: 'Photosynthesis converts light energy into chemical energy stored in glucose molecules.',
      difficulty: 'easy',
      order: 1,
    },
    {
      question: 'Which of the following is NOT a product of photosynthesis?',
      optionA: 'Glucose',
      optionB: 'Oxygen',
      optionC: 'Carbon dioxide',
      optionD: 'Water',
      correctOption: 'C',
      explanation: 'Carbon dioxide is a reactant in photosynthesis, not a product. Products are glucose and oxygen.',
      difficulty: 'easy',
      order: 2,
    },
    {
      question: 'Where does the light-dependent reaction of photosynthesis occur?',
      optionA: 'In the stroma',
      optionB: 'In the thylakoid membrane',
      optionC: 'In the mitochondria',
      optionD: 'In the ribosomes',
      correctOption: 'B',
      explanation: 'Light-dependent reactions occur in the thylakoid membrane of the chloroplast.',
      difficulty: 'medium',
      order: 3,
    },
    {
      question: 'The process by which plants lose water vapor is called:',
      optionA: 'Guttation',
      optionB: 'Transpiration',
      optionC: 'Evaporation',
      optionD: 'Condensation',
      correctOption: 'B',
      explanation: 'Transpiration is the process of water loss from plants through stomata.',
      difficulty: 'easy',
      order: 4,
    },
    {
      question: 'Which tissue in plants is responsible for transportation of water?',
      optionA: 'Phloem',
      optionB: 'Xylem',
      optionC: 'Cambium',
      optionD: 'Cork',
      correctOption: 'B',
      explanation: 'Xylem transports water and minerals from roots to shoots.',
      difficulty: 'easy',
      order: 5,
    },
    {
      question: 'What is the main product of anaerobic respiration in animals?',
      optionA: 'Carbon dioxide and water',
      optionB: 'Lactic acid',
      optionC: 'Ethanol and carbon dioxide',
      optionD: 'Glucose and oxygen',
      correctOption: 'B',
      explanation: 'In anaerobic respiration in animals, glucose is converted to lactic acid.',
      difficulty: 'medium',
      order: 6,
    },
    {
      question: 'Where do light-independent reactions occur?',
      optionA: 'In the thylakoid',
      optionB: 'In the stroma',
      optionC: 'In the mitochondrial matrix',
      optionD: 'In the chlorophyll',
      correctOption: 'B',
      explanation: 'Light-independent reactions (Calvin cycle) occur in the stroma of the chloroplast.',
      difficulty: 'medium',
      order: 7,
    },
    {
      question: 'Which enzyme is responsible for fixing CO2 in the Calvin cycle?',
      optionA: 'RuBisCO',
      optionB: 'Amylase',
      optionC: 'Lipase',
      optionD: 'Protease',
      correctOption: 'A',
      explanation: 'RuBisCO (Ribulose-1,5-bisphosphate carboxylase) fixes CO2 in the Calvin cycle.',
      difficulty: 'hard',
      order: 8,
    },
    {
      question: 'What is the fate of glucose produced in photosynthesis?',
      optionA: 'Only used for respiration',
      optionB: 'Stored as starch or sucrose, or used for respiration',
      optionC: 'Only stored as starch',
      optionD: 'Immediately released to atmosphere',
      correctOption: 'B',
      explanation: 'Glucose is stored as starch or sucrose, transported via phloem, or used for respiration.',
      difficulty: 'medium',
      order: 9,
    },
    {
      question: 'During which phase of the cell cycle does photosynthesis primarily occur?',
      optionA: 'S phase',
      optionB: 'G1 phase',
      optionC: 'G2 phase',
      optionD: 'Interphase',
      correctOption: 'D',
      explanation: 'Photosynthesis occurs during interphase when the cell is not dividing.',
      difficulty: 'hard',
      order: 10,
    },
    {
      question: 'What is the role of ATP in photosynthesis?',
      optionA: 'To provide energy for the Calvin cycle',
      optionB: 'To transport electrons',
      optionC: 'To absorb light',
      optionD: 'To produce glucose',
      correctOption: 'A',
      explanation: 'ATP provides energy for the Calvin cycle (light-independent reactions).',
      difficulty: 'medium',
      order: 11,
    },
    {
      question: 'Which pigment is primarily responsible for light absorption in photosynthesis?',
      optionA: 'Xanthophyll',
      optionB: 'Chlorophyll a',
      optionC: 'Carotene',
      optionD: 'Anthocyanin',
      correctOption: 'B',
      explanation: 'Chlorophyll a is the primary pigment responsible for light absorption.',
      difficulty: 'medium',
      order: 12,
    },
    {
      question: 'What is the equation for aerobic respiration?',
      optionA: 'C6H12O6 + O2 → CO2 + H2O + Energy',
      optionB: 'C6H12O6 → C2H5OH + CO2 + Energy',
      optionC: 'C6H12O6 → Lactic acid + Energy',
      optionD: 'CO2 + H2O → C6H12O6 + O2',
      correctOption: 'A',
      explanation: 'The complete equation for aerobic respiration is C6H12O6 + 6O2 → 6CO2 + 6H2O + Energy.',
      difficulty: 'easy',
      order: 13,
    },
    {
      question: 'How many ATP molecules are produced per glucose in aerobic respiration?',
      optionA: '2',
      optionB: '30-32',
      optionC: '36-38',
      optionD: '50',
      correctOption: 'B',
      explanation: 'Approximately 30-32 ATP molecules are produced from one glucose molecule.',
      difficulty: 'hard',
      order: 14,
    },
    {
      question: 'Where does glycolysis occur in the cell?',
      optionA: 'Mitochondrial matrix',
      optionB: 'Cytoplasm',
      optionC: 'Cristae',
      optionD: 'Stroma',
      correctOption: 'B',
      explanation: 'Glycolysis occurs in the cytoplasm of the cell.',
      difficulty: 'easy',
      order: 15,
    },
    {
      question: 'What is the main function of the Krebs cycle?',
      optionA: 'To produce ATP and electron carriers',
      optionB: 'To break down glucose into pyruvate',
      optionC: 'To produce CO2 only',
      optionD: 'To absorb light energy',
      correctOption: 'A',
      explanation: 'The Krebs cycle produces ATP and electron carriers (NADH, FADH2).',
      difficulty: 'medium',
      order: 16,
    },
    {
      question: 'Which organelle is known as the powerhouse of the cell?',
      optionA: 'Nucleus',
      optionB: 'Mitochondria',
      optionC: 'Chloroplast',
      optionD: 'Ribosome',
      correctOption: 'B',
      explanation: 'Mitochondria is the powerhouse of the cell where ATP is produced.',
      difficulty: 'easy',
      order: 17,
    },
    {
      question: 'What happens to pyruvate in anaerobic conditions?',
      optionA: 'It enters the Krebs cycle',
      optionB: 'It is converted to lactic acid or ethanol',
      optionC: 'It is used for photosynthesis',
      optionD: 'It exits the cell',
      correctOption: 'B',
      explanation: 'In anaerobic conditions, pyruvate is converted to lactic acid or ethanol.',
      difficulty: 'medium',
      order: 18,
    },
    {
      question: 'Which of the following is a product of the light-dependent reaction?',
      optionA: 'Glucose',
      optionB: 'NADPH and ATP',
      optionC: 'Carbon dioxide',
      optionD: 'Starch',
      correctOption: 'B',
      explanation: 'Light-dependent reactions produce NADPH and ATP for the Calvin cycle.',
      difficulty: 'medium',
      order: 19,
    },
    {
      question: 'What is the primary function of the electron transport chain?',
      optionA: 'To break down glucose',
      optionB: 'To produce ATP by oxidizing electron carriers',
      optionC: 'To absorb light',
      optionD: 'To fix CO2',
      correctOption: 'B',
      explanation: 'The electron transport chain produces ATP by oxidizing NADH and FADH2.',
      difficulty: 'hard',
      order: 20,
    },
  ]

  for (const mcqData of mcqsData) {
    await prisma.mCQ.create({
      data: {
        ...mcqData,
        chapterId: chapter.id,
      },
    })
  }

  console.log('Created 20 MCQs')

  console.log('Database seed completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
