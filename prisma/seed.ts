import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Creating enhanced database with rich educational content...\n')

  // Clear existing data
  await prisma.studentAnswer.deleteMany()
  await prisma.assessmentSession.deleteMany()
  await prisma.mCQ.deleteMany()
  await prisma.chapterContent.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.user.deleteMany()

  console.log('👤 Creating sample users...')
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  void await prisma.user.create({
    data: {
      email: 'student@alfanumrik.com',
      password: hashedPassword,
      fullName: 'John Doe',
    },
  })

  console.log('📚 Creating 3 chapters with comprehensive content...\n')

  // ============================================================================
  // CHAPTER 1: CHEMICAL REACTIONS AND EQUATIONS
  // ============================================================================
  void await prisma.chapter.create({
    data: {
      title: 'Chemical Reactions and Equations',
      description: 'Learn how to balance chemical equations and understand different types of chemical reactions with detailed examples and diagrams.',
      subject: 'Chemistry',
      classLevel: '10',
      order: 1,
      content: {
        create: [
          {
            topic: 'Introduction to Chemical Reactions',
            content: `A chemical reaction is a process in which one or more substances (reactants) are converted into one or more different substances (products). During a chemical reaction, atoms are rearranged to form new compounds through breaking and forming of bonds.

Key Characteristics:
• Formation of new substances with completely different properties
• Energy changes (exothermic - releases heat, or endothermic - absorbs heat)
• Breaking of reactant bonds and formation of product bonds
• Observable changes: color change, temperature change, gas evolution, or precipitate formation
• Follows the law of conservation of mass

Real-World Examples:
1. Combustion: Burning of fuel (wood, coal, gas)
2. Rusting: Iron reacting with oxygen to form rust
3. Digestion: Food breaking down in the stomach
4. Photosynthesis: Plants converting light energy into chemical energy
5. Corrosion: Metals reacting with atmospheric elements

The Rate of Reaction:
Reactions can be fast (explosion) or slow (rusting). Factors affecting reaction rate:
- Temperature: Higher temperature increases reaction rate
- Pressure: Higher pressure increases collision frequency
- Concentration: Higher concentration of reactants speeds up reaction
- Catalyst: Substance that speeds up reaction without being consumed
- Surface Area: Larger surface area increases reaction rate`,
            order: 1,
            diagramUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Exothermic_reaction.svg/400px-Exothermic_reaction.svg.png',
            diagramTitle: 'Exothermic Reaction Energy Diagram',
            keyPoints: JSON.stringify([
              'Chemical reactions involve rearrangement of atoms',
              'Reactants transform into products with different properties',
              'Energy is always involved (absorbed or released)',
              'Reactions follow the law of conservation of mass',
              'Observable signs: color, temperature, gas, precipitate'
            ]),
            resources: JSON.stringify([
              { title: 'Khan Academy - Chemical Reactions', url: 'https://www.khanacademy.org/science/chemistry/chemical-reactions-stoichiometry' },
              { title: 'NCERT Chemistry Class 10', url: 'https://ncert.nic.in/' },
              { title: 'Types of Chemical Reactions', url: 'https://www.byjus.com/chemistry/types-of-chemical-reactions/' }
            ])
          },
          {
            topic: 'Balancing Chemical Equations',
            content: `Balancing chemical equations ensures that the number of atoms of each element is the same on both sides of the equation, following the law of conservation of mass.

Why Balance Equations?
• Represents actual composition of reactants and products
• Provides correct stoichiometric ratios for calculations
• Essential for solving chemistry problems
• Required by law of conservation of mass (matter cannot be created or destroyed)

Steps to Balance Equations (Hit and Trial Method):
1. Count atoms of each element on both sides (initially unbalanced)
2. Start with the most complex molecule
3. Adjust coefficients (not subscripts) to balance
4. Balance metals first, then non-metals, then hydrogen, then oxygen
5. Verify all elements are balanced on both sides
6. Use smallest whole number coefficients

Example with Step-by-Step Solution:
Unbalanced: Fe + O₂ → Fe₂O₃

Step 1: Count atoms:
Left: Fe = 1, O = 2
Right: Fe = 2, O = 3 (Unbalanced)

Step 2: Balance Iron (Fe):
4Fe + O₂ → 2Fe₂O₃ (Balanced Fe on both sides)

Step 3: Balance Oxygen:
4Fe + 3O₂ → 2Fe₂O₃
Check: Left: Fe = 4, O = 6 ✓
Right: Fe = 4, O = 6 ✓

Common Coefficients Used:
2, 3, 4, 5, 6 (rarely go beyond)

Types of Equations:
1. Skeleton Equation: Shows formula without coefficients
2. Unbalanced Equation: Shows formulas but wrong coefficients
3. Balanced Equation: Correct coefficients for conservation of mass`,
            order: 2,
            chartUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Balancing_Chemical_Equation_Example.svg/640px-Balancing_Chemical_Equation_Example.svg.png',
            chartTitle: 'Step-by-Step Balancing Process',
            keyPoints: JSON.stringify([
              'Law of conservation of mass must be obeyed',
              'Coefficients are used to balance equations',
              'Subscripts in chemical formulas cannot be changed',
              'Start with most complex molecule',
              'Always verify the final balanced equation'
            ]),
            resources: JSON.stringify([
              { title: 'Balancing Equations Practice', url: 'https://www.chemistry-online.com' },
              { title: 'Stoichiometry Guide', url: 'https://www.thoughtco.com/stoichiometry' },
              { title: 'Interactive Balancing Tool', url: 'https://www.chembalancer.com' }
            ])
          },
          {
            topic: 'Types of Chemical Reactions',
            content: `Chemical reactions can be classified into different types based on the nature of changes occurring and the type of reactants and products involved.

1. COMBINATION REACTIONS (Synthesis)
Definition: Two or more substances combine to form a single product
General Form: A + B → AB

Examples:
• C + O₂ → CO₂ (Carbon burns in oxygen)
• 2H₂ + O₂ → 2H₂O (Hydrogen burns in oxygen)
• Na + Cl₂ → 2NaCl (Sodium reacts with chlorine)
• Mg + O₂ → 2MgO (Magnesium burns in oxygen)

2. DECOMPOSITION REACTIONS
Definition: One substance breaks down into two or more simpler substances
General Form: AB → A + B

Examples:
• 2H₂O → 2H₂ + O₂ (Water decomposes with electricity)
• 2KClO₃ → 2KCl + 3O₂ (Potassium chlorate decomposes with heat)
• CaCO₃ → CaO + CO₂ (Calcium carbonate decomposes on heating)
• 2PbO → 2Pb + O₂ (Lead oxide decomposes)

3. DISPLACEMENT REACTIONS
Definition: One element displaces another from its compound
General Form: A + BC → AC + B

Examples:
• Fe + CuSO₄ → FeSO₄ + Cu (Iron displaces copper)
• Zn + 2HCl → ZnCl₂ + H₂ (Zinc displaces hydrogen)
• Cl₂ + 2NaBr → 2NaCl + Br₂ (Chlorine displaces bromine)
• Al + Fe₂O₃ → Al₂O₃ + Fe (Aluminum displaces iron)

4. DOUBLE DISPLACEMENT REACTIONS
Definition: Two compounds exchange their ions to form two new compounds
General Form: AB + CD → AD + CB

Examples:
• AgNO₃ + NaCl → AgCl + NaNO₃ (Forms white precipitate)
• BaCl₂ + Na₂SO₄ → BaSO₄ + 2NaCl
• Pb(NO₃)₂ + KI → PbI₂ + KNO₃ (Forms yellow precipitate)
• HCl + NaOH → NaCl + H₂O (Neutralization reaction)

5. REDOX REACTIONS
Definition: Reactions where oxidation and reduction occur simultaneously
• Oxidation: Loss of electrons
• Reduction: Gain of electrons

Examples:
• 2Na + Cl₂ → 2NaCl (Redox reaction)
• Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag (Redox reaction)`,
            order: 3,
            keyPoints: JSON.stringify([
              'Combination reactions produce fewer products',
              'Decomposition reactions produce more products',
              'Displacement involves replacement of elements',
              'Double displacement swaps ions between compounds',
              'Redox reactions involve electron transfer'
            ]),
            resources: JSON.stringify([
              { title: 'Chemical Reaction Types', url: 'https://www.byjus.com/chemistry/types-of-chemical-reactions/' },
              { title: 'NCERT Solutions', url: 'https://ncert.nic.in/' },
              { title: 'Reaction Type Classification', url: 'https://www.vedantu.com/chemistry/types-of-chemical-reactions' }
            ])
          },
          {
            topic: 'Redox Reactions and Oxidation States',
            content: `Redox reactions involve the transfer of electrons between chemical species. Understanding oxidation states is crucial for identifying redox reactions.

OXIDATION STATE RULES:
1. Oxidation state of an element in its elementary form = 0
   (Cl₂ = 0, Fe = 0, O₂ = 0, H₂ = 0)

2. Oxidation state of a monatomic ion = charge of the ion
   (Na⁺ = +1, Cl⁻ = -1, Ca²⁺ = +2, O²⁻ = -2)

3. Oxygen usually has oxidation state = -2
   EXCEPT in peroxides (H₂O₂) where it = -1

4. Hydrogen usually has oxidation state = +1
   EXCEPT in hydrides (NaH) where it = -1

5. Fluorine always has oxidation state = -1

6. In neutral compounds, sum of oxidation states = 0
   In polyatomic ions, sum = charge of ion

IDENTIFYING REDOX REACTIONS:
• If oxidation state changes, it's a redox reaction
• LEO says GER: Loss of Electrons = Oxidation, Gain of Electrons = Reduction

Example Analysis:
2Na + Cl₂ → 2NaCl
• Na: 0 → +1 (loses 1 electron = oxidation)
• Cl: 0 → -1 (gains 1 electron = reduction)
• This is a REDOX REACTION

OXIDIZING AND REDUCING AGENTS:
• Oxidizing agent: Gets reduced (gains electrons)
• Reducing agent: Gets oxidized (loses electrons)

In 2Na + Cl₂ → 2NaCl:
• Na is the reducing agent (gets oxidized)
• Cl₂ is the oxidizing agent (gets reduced)

PRACTICAL APPLICATIONS:
• Combustion reactions (burning)
• Corrosion of metals
• Galvanic cells (batteries)
• Photosynthesis and respiration
• Industrial processes (smelting of ores)`,
            order: 4,
            keyPoints: JSON.stringify([
              'Oxidation is loss of electrons (LEO)',
              'Reduction is gain of electrons (GER)',
              'Oxidizing agent is reduced',
              'Reducing agent is oxidized',
              'Electrons lost must equal electrons gained'
            ]),
            resources: JSON.stringify([
              { title: 'Oxidation and Reduction', url: 'https://www.khanacademy.org/science/chemistry/redox-reactions' },
              { title: 'Oxidation States Tutorial', url: 'https://www.chemistrylearner.com' },
              { title: 'NCERT Chemistry Chapter 3', url: 'https://ncert.nic.in/' }
            ])
          }
        ]
      },
      mcqs: {
        create: [
          {
            question: 'Which of the following is an example of a combination reaction?',
            optionA: 'Fe + CuSO₄ → FeSO₄ + Cu',
            optionB: 'C + O₂ → CO₂',
            optionC: '2H₂O → 2H₂ + O₂',
            optionD: 'AgNO₃ + NaCl → AgCl + NaNO₃',
            correctOption: 'B',
            explanation: 'In a combination reaction, two substances combine to form one product. C + O₂ → CO₂ is a combination reaction where carbon and oxygen combine to form carbon dioxide. This is a synthesis reaction.',
            difficulty: 'easy',
            order: 1
          },
          {
            question: 'In the equation: 2Na + Cl₂ → 2NaCl, which element is oxidized?',
            optionA: 'Cl',
            optionB: 'Na',
            optionC: 'Both Na and Cl',
            optionD: 'Neither',
            correctOption: 'B',
            explanation: 'Sodium (Na) goes from oxidation state 0 to +1, losing electrons (oxidation). Chlorine gains electrons (reduction). LEO says GER: Lose Electrons = Oxidation.',
            difficulty: 'medium',
            order: 2
          },
          {
            question: 'What is the oxidation state of oxygen in H₂O₂ (hydrogen peroxide)?',
            optionA: '-2',
            optionB: '-1',
            optionC: '+1',
            optionD: '+2',
            correctOption: 'B',
            explanation: 'In peroxides like H₂O₂, oxygen has an oxidation state of -1, which is an exception to the normal rule of -2 for oxygen in other compounds.',
            difficulty: 'hard',
            order: 3
          },
          {
            question: 'Which type of reaction involves the breaking down of a single compound?',
            optionA: 'Combination reaction',
            optionB: 'Displacement reaction',
            optionC: 'Decomposition reaction',
            optionD: 'Double displacement reaction',
            correctOption: 'C',
            explanation: 'Decomposition reactions break down one substance into two or more simpler substances, like 2H₂O → 2H₂ + O₂ (electrolysis of water).',
            difficulty: 'easy',
            order: 4
          },
          {
            question: 'In a redox reaction, the substance that loses electrons is called:',
            optionA: 'Reducing agent',
            optionB: 'Oxidizing agent',
            optionC: 'Catalyst',
            optionD: 'Activator',
            correctOption: 'A',
            explanation: 'The reducing agent is the substance that loses electrons (gets oxidized) and causes reduction of another substance. The oxidizing agent gains electrons.',
            difficulty: 'medium',
            order: 5
          }
        ]
      }
    }
  })

  console.log('✅ Chapter 1: Chemical Reactions (5 MCQs)')

  // ============================================================================
  // CHAPTER 2: ACIDS, BASES AND SALTS
  // ============================================================================
  void await prisma.chapter.create({
    data: {
      title: 'Acids, Bases and Salts',
      description: 'Understand the properties and reactions of acids, bases, and salts with pH scale and neutralization.',
      subject: 'Chemistry',
      classLevel: '10',
      order: 2,
      content: {
        create: [
          {
            topic: 'Properties of Acids and Bases',
            content: `ACIDS:
An acid is a substance that produces hydrogen ions (H⁺) in aqueous solution.

Physical Properties of Acids:
• Sour taste (don't taste unknown substances!)
• Turn blue litmus paper red
• Conduct electricity in solution
• Corrosive in nature
• pH < 7 (acidic)
• Soluble in water

Chemical Properties of Acids:
• React with bases to form salts and water (neutralization)
• React with metals to produce hydrogen gas
• React with carbonates to produce CO₂ gas
• Donate H⁺ ions in solution

Common Acids:
• Hydrochloric acid (HCl) - stomach acid
• Sulfuric acid (H₂SO₄) - battery acid
• Nitric acid (HNO₃) - fertilizer production
• Acetic acid (CH₃COOH) - vinegar
• Citric acid - citrus fruits
• Lactic acid - yogurt, sour milk

BASES:
A base is a substance that produces hydroxide ions (OH⁻) in aqueous solution.

Physical Properties of Bases:
• Bitter taste (don't taste unknown substances!)
• Feel slippery/soapy
• Turn red litmus paper blue
• Conduct electricity in solution
• pH > 7 (basic/alkaline)
• Soluble in water

Chemical Properties of Bases:
• React with acids to form salts and water (neutralization)
• React with non-metallic oxides to form salts and water
• Some bases (alkali) conduct electricity better
• Accept H⁺ ions or donate OH⁻ ions

Common Bases:
• Sodium hydroxide (NaOH) - caustic soda
• Potassium hydroxide (KOH) - potash
• Calcium hydroxide (Ca(OH)₂) - slaked lime
• Ammonia (NH₃) - cleaning agent
• Magnesium hydroxide (Mg(OH)₂) - antacid

INDICATORS - Substances that Show Acid/Base:
1. Litmus Paper:
   - Blue litmus → Red in acid, stays blue in base
   - Red litmus → Stays red in acid, turns blue in base

2. Methyl Orange:
   - Pink in acid, Yellow in base

3. Phenolphthalein:
   - Colorless in acid, Pink/magenta in base

4. Turmeric (Natural):
   - Yellow in neutral/acid, Red in base

5. Flower Petals (Red Cabbage):
   - Pink in acid, Green in neutral, Purple in base`,
            order: 1,
            keyPoints: JSON.stringify([
              'Acids turn blue litmus red (pH < 7)',
              'Bases turn red litmus blue (pH > 7)',
              'Strong acids completely ionize',
              'Weak acids partially ionize',
              'Alkali are soluble bases'
            ]),
            resources: JSON.stringify([
              { title: 'Acids and Bases Properties', url: 'https://www.khanacademy.org/science/chemistry/acids-bases' },
              { title: 'NCERT Chemistry Chapter 2', url: 'https://ncert.nic.in/' },
              { title: 'Indicator Test Guide', url: 'https://www.byjus.com/chemistry/indicators/' }
            ])
          },
          {
            topic: 'pH Scale and Neutralization',
            content: `pH SCALE:
The pH scale measures the concentration of hydrogen ions (H⁺) in a solution, indicating how acidic or basic it is.

pH Formula: pH = -log[H⁺]

Where [H⁺] = concentration of hydrogen ions in moles per liter

pH Scale Values:
• pH 0: Extremely acidic (strong acid)
• pH 0-6.9: Acidic solutions
• pH 7: Neutral (pure water at 25°C)
• pH 7.1-14: Basic/Alkaline solutions
• pH 14: Extremely basic (strong base)

pH Examples:
• pH 1: Stomach acid, Battery acid
• pH 2: Lemon juice, Vinegar
• pH 3: Tomato juice, Soft drinks
• pH 5: Black coffee, Rainwater
• pH 7: Pure water, Milk
• pH 8: Sea water, Baking soda solution
• pH 10: Milk of magnesia
• pH 12: Soapy water
• pH 14: Sodium hydroxide solution

pH Measurement Methods:
1. pH Paper/Strip - Shows approximate pH
2. Digital pH Meter - Precise measurement
3. Indicators - Colorimetric method
4. Calculations - Using [H⁺] concentration

Important Concepts:
• pH decreases by 1 = 10× increase in H⁺ concentration
• pH increases by 1 = 10× decrease in H⁺ concentration
• pOH = 14 - pH (relationship between pH and pOH)

NEUTRALIZATION REACTIONS:
A neutralization reaction occurs when an acid reacts with a base to produce a salt and water.

General Equation:
Acid + Base → Salt + Water
H⁺ + OH⁻ → H₂O (ionic equation)

Examples:
1. HCl + NaOH → NaCl + H₂O
   (Hydrochloric acid + Sodium hydroxide → Sodium chloride + Water)

2. H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O
   (Sulfuric acid + Sodium hydroxide → Sodium sulfate + Water)

3. 2HNO₃ + Ca(OH)₂ → Ca(NO₃)₂ + 2H₂O

Characteristics of Neutralization:
• It's an exothermic reaction (releases heat)
• Complete neutralization occurs at pH 7
• The exact ratio of acid and base depends on their strength
• Forms a salt that can be acidic, basic, or neutral

Applications:
• Treating acid burns: Apply bases like baking soda or milk of magnesia
• Treating base burns: Apply acids
• Antacids: Neutralize stomach acid (HCl)
• Water treatment: Adjust pH for safe drinking water`,
            order: 2,
            keyPoints: JSON.stringify([
              'pH scale ranges from 0 to 14',
              'pH 7 is neutral (pure water)',
              'pH < 7 indicates acidic solutions',
              'pH > 7 indicates basic solutions',
              'Neutralization releases heat'
            ]),
            resources: JSON.stringify([
              { title: 'pH Scale Explanation', url: 'https://www.khanacademy.org/science/chemistry/acids-bases' },
              { title: 'Neutralization Reactions', url: 'https://www.byjus.com/chemistry/neutralization-reaction/' },
              { title: 'pH Measurement Guide', url: 'https://www.chemistrylearner.com' }
            ])
          },
          {
            topic: 'Salts and Their Properties',
            content: `DEFINITION:
A salt is an ionic compound formed when an acid reacts with a base. It consists of cations (positive ions) from the base and anions (negative ions) from the acid.

FORMATION OF SALTS:
Acid + Base → Salt + Water

Examples:
• HCl + NaOH → NaCl + H₂O
• H₂SO₄ + CuO → CuSO₄ + H₂O
• 2HNO₃ + Ca(OH)₂ → Ca(NO₃)₂ + 2H₂O

CLASSIFICATION OF SALTS:

1. NORMAL SALTS
Definition: Formed from complete neutralization of acid and base
Characteristics: pH = 7 (neutral)
• NaCl (Sodium chloride) - table salt
• KNO₃ (Potassium nitrate) - fertilizer
• CaCO₃ (Calcium carbonate) - limestone
• BaSO₄ (Barium sulfate) - white powder
• AgCl (Silver chloride) - white precipitate

2. ACIDIC SALTS
Definition: Contain unreacted acid groups (excess H⁺)
Characteristics: pH < 7 (acidic)
• NaHSO₄ (Sodium bisulfate) - from H₂SO₄ + NaOH
• KH₂PO₄ (Potassium dihydrogen phosphate)
• NaHCO₃ (Sodium bicarbonate) - baking soda

3. BASIC SALTS
Definition: Contain unreacted base groups (excess OH⁻)
Characteristics: pH > 7 (basic)
• Ca(OCl)₂ (Calcium hypochlorite) - bleaching powder
• Zn(OH)Cl (Zinc hydroxychloride)
• CuOHNO₃ (Copper hydroxide nitrate)

IMPORTANT SALTS IN DAILY LIFE:
• NaCl: Food preservation, de-icing, chemical industry
• CaSO₄: Plaster of Paris, desiccant
• NaHCO₃: Baking soda, fire extinguisher
• K₂SO₄: Fertilizer
• MgSO₄: Epsom salt, laxative
• FeSO₄: Iron supplement, water treatment
• CuSO₄: Fungicide, blue vitriol
• KMnO₄: Oxidizing agent, disinfectant`,
            order: 3,
            keyPoints: JSON.stringify([
              'Salts are ionic compounds from acid-base reactions',
              'Normal salts have pH 7',
              'Acidic salts have pH < 7',
              'Basic salts have pH > 7',
              'Salts dissolve in water (most are soluble)'
            ]),
            resources: JSON.stringify([
              { title: 'Salt Types and Properties', url: 'https://www.toppr.com/guides/chemistry/salts/' },
              { title: 'Common Salts Uses', url: 'https://www.vedantu.com/chemistry/salts' },
              { title: 'Salt Hydrolysis', url: 'https://www.chemistrylearner.com' }
            ])
          },
          {
            topic: 'Strong and Weak Acids/Bases',
            content: `STRONG ACIDS:
Definition: Acids that completely ionize (dissociate) in water, releasing all H⁺ ions.

The 7 Strong Acids (remember HBrNOClIC):
1. HCl - Hydrochloric acid
2. HBr - Hydrobromic acid
3. HI - Hydroiodic acid
4. HNO₃ - Nitric acid
5. H₂SO₄ - Sulfuric acid
6. HClO₄ - Perchloric acid
7. HClO₃ - Chloric acid

Ionization in Water:
HCl → H⁺ + Cl⁻ (100% ionization)

Properties:
• Completely dissociate in water
• Conduct electricity very well
• Strong pH values (very acidic)
• Dangerous and corrosive

WEAK ACIDS:
Definition: Acids that partially ionize in water, only releasing some H⁺ ions.

Common Weak Acids:
• CH₃COOH (Acetic acid) - vinegar
• HF (Hydrofluoric acid)
• H₂CO₃ (Carbonic acid)
• H₂SO₃ (Sulfurous acid)
• HNO₂ (Nitrous acid)
• C₆H₅COOH (Benzoic acid)

Ionization in Water:
CH₃COOH ⇌ CH₃COO⁻ + H⁺ (Partial ionization, equilibrium)

Properties:
• Partially dissociate in water
• Conduct electricity moderately
• Weaker pH values
• Less dangerous

STRONG BASES:
Definition: Bases that completely ionize in water, releasing all OH⁻ ions.

Strong Bases (Group 1 and Group 2 hydroxides):
• NaOH - Sodium hydroxide (caustic soda)
• KOH - Potassium hydroxide (caustic potash)
• Ca(OH)₂ - Calcium hydroxide (slaked lime)
• Ba(OH)₂ - Barium hydroxide
• LiOH - Lithium hydroxide

Ionization in Water:
NaOH → Na⁺ + OH⁻ (100% ionization)

Properties:
• Completely dissociate in water
• High conductivity
• Strong alkalinity
• Very corrosive

WEAK BASES:
Definition: Bases that partially ionize in water, only releasing some OH⁻ ions.

Common Weak Bases:
• NH₃ (Ammonia) - cleaning agent
• C₅H₅N (Pyridine)
• CH₃NH₂ (Methylamine)
• Aniline derivatives

Ionization in Water:
NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ (Partial ionization)

Properties:
• Partially dissociate in water
• Conduct electricity moderately
• Weaker basicity
• Less corrosive

SUMMARY TABLE:
[Acid/Base Type | Ionization | Conductivity | pH | Examples]
Strong Acid | Complete | High | 1-3 | HCl, HNO₃
Weak Acid | Partial | Moderate | 4-6 | CH₃COOH
Neutral | - | Low | 7 | H₂O
Weak Base | Partial | Moderate | 8-10 | NH₃
Strong Base | Complete | High | 11-13 | NaOH, KOH`,
            order: 4,
            keyPoints: JSON.stringify([
              'Strong acids completely ionize',
              'Weak acids partially ionize',
              'There are 7 strong acids to memorize',
              'Group 1 & 2 hydroxides are strong bases',
              'Ionization constant Ka/Kb measures strength'
            ]),
            resources: JSON.stringify([
              { title: 'Strong vs Weak Acids', url: 'https://www.khanacademy.org/science/chemistry/acids-bases' },
              { title: 'Ionization Constants', url: 'https://www.chemistrylearner.com' },
              { title: 'NCERT Chapter 2', url: 'https://ncert.nic.in/' }
            ])
          }
        ]
      },
      mcqs: {
        create: [
          {
            question: 'Which indicator turns blue in basic solutions?',
            optionA: 'Methyl orange',
            optionB: 'Litmus paper',
            optionC: 'Phenolphthalein',
            optionD: 'Turmeric',
            correctOption: 'B',
            explanation: 'Blue litmus paper remains blue in basic solutions and turns red in acidic solutions. Red litmus paper turns blue in basic solutions.',
            difficulty: 'easy',
            order: 1
          },
          {
            question: 'What is the pH of a neutral solution?',
            optionA: '0',
            optionB: '7',
            optionC: '14',
            optionD: '10',
            correctOption: 'B',
            explanation: 'Pure water and neutral solutions have a pH of 7. pH < 7 indicates acidic solutions and pH > 7 indicates basic solutions.',
            difficulty: 'easy',
            order: 2
          },
          {
            question: 'In the reaction: HCl + NaOH → NaCl + H₂O, the salt formed is:',
            optionA: 'HCl',
            optionB: 'NaOH',
            optionC: 'NaCl',
            optionD: 'H₂O',
            correctOption: 'C',
            explanation: 'Sodium chloride (NaCl) is the salt formed in this neutralization reaction between hydrochloric acid and sodium hydroxide.',
            difficulty: 'medium',
            order: 3
          },
          {
            question: 'Which of the following is a strong acid?',
            optionA: 'Acetic acid',
            optionB: 'Hydrochloric acid',
            optionC: 'Carbonic acid',
            optionD: 'Sulfurous acid',
            correctOption: 'B',
            explanation: 'Hydrochloric acid (HCl) is one of the 7 strong acids that completely ionize in water. Acetic acid is a weak acid.',
            difficulty: 'hard',
            order: 4
          },
          {
            question: 'What does pH 6 indicate?',
            optionA: 'Strongly acidic',
            optionB: 'Weakly acidic',
            optionC: 'Neutral',
            optionD: 'Weakly basic',
            correctOption: 'B',
            explanation: 'pH 6 is below 7, so it is acidic. It is weakly acidic, not strongly acidic (which would be pH 1-3).',
            difficulty: 'medium',
            order: 5
          }
        ]
      }
    }
  })

  console.log('✅ Chapter 2: Acids, Bases and Salts (5 MCQs)')

  // ============================================================================
  // CHAPTER 3: METALS AND NON-METALS
  // ============================================================================
  void await prisma.chapter.create({
    data: {
      title: 'Metals and Non-metals',
      description: 'Learn about the properties of metals and non-metals, their reactions, and applications.',
      subject: 'Chemistry',
      classLevel: '10',
      order: 3,
      content: {
        create: [
          {
            topic: 'Physical and Chemical Properties',
            content: `METALS:
Metals are elements that typically have characteristic properties related to their electron structure and metallic bonding.

PHYSICAL PROPERTIES OF METALS:
1. Lustre (Shine):
   • Metals are shiny and reflective
   • Reflect light from their surface
   • Examples: Silver, Copper, Gold

2. Malleability:
   • Can be beaten into thin sheets
   • Atoms slide over each other without breaking bonds
   • Examples: Gold leaf, Aluminum foil

3. Ductility:
   • Can be drawn into thin wires
   • Can withstand tensile stress
   • Examples: Copper wires, Gold wires

4. Electrical Conductivity:
   • Excellent conductors of electricity
   • Due to free electrons (mobile charge carriers)
   • Examples: Copper, Aluminum, Silver

5. Thermal Conductivity:
   • Good conductors of heat
   • Transfer heat quickly
   • Examples: Copper, Aluminum, Iron

6. Sonority:
   • Produce sound when struck
   • Ringing sound (bell metal)
   • Used in instruments, bells

7. Density:
   • Generally high density
   • Exceptions: Alkali metals (Na, K) have low density
   • Iron: 7.87 g/cm³, Lead: 11.34 g/cm³

8. Melting and Boiling Points:
   • Generally high (not absolute)
   • Tungsten: 3,422°C (highest)
   • Mercury: -39°C (lowest metal, liquid at room temp)

CHEMICAL PROPERTIES OF METALS:

1. Reaction with Oxygen:
   • Form basic oxides (Al₂O₃, Na₂O₂)
   • 2Mg + O₂ → 2MgO
   • 4Na + O₂ → 2Na₂O₂

2. Reaction with Water:
   • Alkali metals react vigorously (2Na + 2H₂O → 2NaOH + H₂↑)
   • Alkaline earth metals react (Ca + 2H₂O → Ca(OH)₂ + H₂↑)
   • Less reactive metals don't react

3. Reaction with Acids:
   • Displace hydrogen from acids
   • Zn + 2HCl → ZnCl₂ + H₂↑
   • Not all metals react (Au, Ag, Cu don't)

4. Electron Loss:
   • Lose electrons to form cations
   • Na → Na⁺ + e⁻
   • Mg → Mg²⁺ + 2e⁻

5. Displacement Reactions:
   • More reactive metals displace less reactive ones
   • Fe + CuSO₄ → FeSO₄ + Cu

COMMON METALS AND THEIR USES:
• Iron (Fe): Construction, machinery, tools
• Copper (Cu): Electrical wires, pipes, coins
• Aluminum (Al): Aircraft, packaging, cookware
• Gold (Au): Jewelry, electronics, dentistry
• Silver (Ag): Jewelry, photography, conductors
• Tin (Sn): Coating, alloys
• Zinc (Zn): Galvanization, batteries, alloys
• Lead (Pb): Batteries, radiation shielding
• Nickel (Ni): Coins, alloys, plating
• Chromium (Cr): Stainless steel, plating

NON-METALS:
Non-metals are elements that lack the typical properties of metals.

PHYSICAL PROPERTIES OF NON-METALS:

1. Lustre:
   • Dull (not shiny)
   • Don't reflect light
   • Examples: Carbon, Sulfur, Phosphorus

2. Brittleness:
   • Break easily when struck
   • Not malleable or ductile
   • Examples: Sulfur, White phosphorus

3. Electrical Conductivity:
   • Poor conductors (insulators)
   • Exception: Graphite conducts electricity
   • No free electrons for conduction

4. Thermal Conductivity:
   • Poor conductors of heat
   • Exceptions: Diamond conducts well
   • Used as insulators

5. States of Matter:
   • Can be solids, liquids, or gases
   • Solids: Carbon, Sulfur, Iodine
   • Liquid: Bromine (only liquid non-metal)
   • Gases: O₂, N₂, Cl₂, F₂, H₂, Noble gases

6. Density:
   • Generally low (with exceptions)
   • Gaseous non-metals have very low density

7. Melting and Boiling Points:
   • Generally low
   • Diamond (C): 3,550°C (highest)
   • Iodine: 184.4°C, Sulfur: 445°C

CHEMICAL PROPERTIES OF NON-METALS:

1. Reaction with Oxygen:
   • Form acidic oxides
   • S + O₂ → SO₂
   • 4P + 5O₂ → 2P₂O₅

2. Reaction with Metals:
   • Gain electrons to form anions
   • 2Na + Cl₂ → 2NaCl
   • 2Na + O₂ → Na₂O₂

3. Covalent Bonding:
   • Form covalent bonds with other non-metals
   • H₂, Cl₂, O₂ (diatomic molecules)
   • CO₂, NH₃ (polyatomic molecules)

4. Electron Gain:
   • Accept electrons to form anions
   • Cl + e⁻ → Cl⁻
   • O + 2e⁻ → O²⁻

COMMON NON-METALS AND USES:
• Oxygen (O₂): Respiration, combustion, industrial processes
• Nitrogen (N₂): Fertilizers, refrigeration, inert atmosphere
• Carbon (C): Fuels, diamond, graphite, organic compounds
• Sulfur (S): Sulfuric acid, matches, vulcanization
• Phosphorus (P): Fertilizers, matches, fireworks
• Chlorine (Cl₂): Water purification, bleach, PVC production
• Bromine (Br₂): Photography, pesticides, dyes
• Iodine (I₂): Disinfectant, medicine, food additive

METALLOIDS (Semi-metals):
Elements with properties between metals and non-metals:
• Silicon (Si): Semiconductors, solar cells
• Arsenic (As): Semiconductors, pesticides
• Antimony (Sb): Flame retardants, alloys
• Boron (B): Glass, ceramics, pesticides
• Germanium (Ge): Semiconductors`,
            order: 1,
            keyPoints: JSON.stringify([
              'Metals conduct electricity due to free electrons',
              'Metallic bonding holds metal atoms together',
              'Metals form cations by losing electrons',
              'Non-metals form anions by gaining electrons',
              'Graphite is a non-metal conductor'
            ]),
            resources: JSON.stringify([
              { title: 'Properties of Metals', url: 'https://www.byjus.com/chemistry/properties-of-metals/' },
              { title: 'Properties of Non-metals', url: 'https://www.toppr.com/guides/chemistry/periodic-classification-of-elements/non-metals/' },
              { title: 'Metal and Non-metal Comparison', url: 'https://www.vedantu.com/chemistry/metals-and-non-metals' }
            ])
          },
          {
            topic: 'Reactivity Series of Metals',
            content: `WHAT IS REACTIVITY SERIES?
The reactivity series (or activity series) is an arrangement of metals in the order of their decreasing reactivity or tendency to lose electrons and form positive ions.

THE REACTIVITY SERIES (Most to Least Reactive):
K > Na > Ca > Mg > Al > Zn > Fe > Cu > Ag > Au

Extended Series (Common metals):
K (Potassium) - Most reactive
Na (Sodium)
Ca (Calcium)
Mg (Magnesium)
Al (Aluminum)
Zn (Zinc)
Fe (Iron)
Cu (Copper)
Ag (Silver)
Au (Gold) - Least reactive

TRENDS IN REACTIVITY SERIES:

1. Metals higher in the series:
   • More reactive (lose electrons more easily)
   • Form positive ions more readily
   • React vigorously with oxygen and water
   • More easily oxidized

2. Metals lower in the series:
   • Less reactive (harder to lose electrons)
   • Form positive ions with difficulty
   • React slowly or not at all
   • More resistant to oxidation

3. Reactivity decreases from:
   • Left to right in a period
   • Top to bottom in a group (opposite trend)

HOW TO USE REACTIVITY SERIES:

1. PREDICTING DISPLACEMENT REACTIONS:
Rule: A metal higher in the series can displace a lower metal from its salt solution.

Examples:
• Fe + CuSO₄ → FeSO₄ + Cu
  (Iron is above copper, so displaces it)

• Zn + FeSO₄ → ZnSO₄ + Fe
  (Zinc is above iron, so displaces it)

• Cu + AgNO₃ → Cu(NO₃) + Ag
  (Copper is above silver, so displaces it)

Counter-example (doesn't happen):
• Cu + ZnSO₄ ✗ (No reaction - Cu is below Zn)
• Ag + NaCl ✗ (No reaction - Ag is below Na)

2. PREDICTING REACTIONS WITH OXYGEN:
Metals higher in series form basic oxides:
• 2Mg + O₂ → 2MgO
• 4Na + O₂ → 2Na₂O₂

3. PREDICTING REACTIONS WITH WATER:
• Alkali metals (K, Na) react vigorously: 2K + 2H₂O → 2KOH + H₂↑
• Mg reacts with steam: Mg + H₂O(g) → MgO + H₂↑
• Less reactive metals don't react

4. PREDICTING REACTIONS WITH ACIDS:
• Metals above Cu react with dilute acids
• Zn + 2HCl → ZnCl₂ + H₂↑
• Cu, Ag, Au don't react with dilute HCl

PRACTICAL APPLICATIONS:

1. CORROSION PREVENTION (Sacrificial Protection):
• Zinc is above iron
• Zn coating on iron protects it (galvanization)
• Zinc gets oxidized first, protecting iron
• Used for: Nails, pipes, roofing sheets

2. EXTRACTION OF METALS:
From reactivity series:
• Very reactive metals (K, Na): Electrolysis required
  • Na extracted by electrolysis of molten NaCl
• Moderately reactive metals (Zn, Fe): Displacement with carbon
  • ZnO + C → Zn + CO
  • Fe₂O₃ + 3C → 2Fe + 3CO
• Less reactive metals (Cu, Ag): Simple reduction
  • 2CuO + C → 2Cu + CO₂

3. METAL STORAGE:
Higher reactivity → More careful storage
• Potassium & Sodium: Stored under kerosene/oil
• Calcium & Magnesium: Stored in dry conditions
• Zinc & Iron: Can be stored normally
• Copper & Silver: No special storage needed

4. HEAT GENERATION (Thermite Process):
Using reactive metals to displace other metals with heat:
• Fe₂O₃ + 2Al → 2Fe + Al₂O₃ + Heat
• Used for welding, cutting steel rails

5. ALLOY FORMATION:
• Steel (Fe + C)
• Brass (Cu + Zn)
• Bronze (Cu + Sn)
• Stainless steel (Fe + Cr + Ni)`,
            order: 2,
            keyPoints: JSON.stringify([
              'Reactivity decreases from left to right',
              'More reactive metals displace less reactive ones',
              'Potassium is the most reactive metal',
              'Gold is the least reactive metal',
              'Reactivity series helps predict reactions'
            ]),
            resources: JSON.stringify([
              { title: 'Reactivity Series', url: 'https://www.byjus.com/chemistry/reactivity-series/' },
              { title: 'Displacement Reactions', url: 'https://www.khanacademy.org/science/chemistry' },
              { title: 'Metal Extraction', url: 'https://www.britannica.com/technology/metallurgy' }
            ])
          },
          {
            topic: 'Corrosion and Rust Prevention',
            content: `WHAT IS CORROSION?
Corrosion is the gradual destruction and deterioration of materials (usually metals) due to chemical reactions with their environment (oxygen, water, acids, bases).

Economic Impact:
• Corrosion costs industries billions of dollars annually
• Weakens structures and causes failures
• Loss of valuable metals

COMMON TYPES OF CORROSION:

1. RUSTING (Oxidation of Iron):
Definition: Gradual oxidation of iron in presence of oxygen and water

Chemical Reaction:
• 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃
• Or: 2Fe + O₂ + 2H₂O → 2Fe(OH)₂ (initially)
• Fe(OH)₂ oxidizes to Fe(OH)₃ (reddish-brown)

Visible Changes:
• Formation of reddish-brown powder
• Loss of metallic shine
• Weakening of metal structure
• Discoloration and flaking

Real-World Examples:
• Iron gates and railings turn brown
• Rusted tools become weak
• Car bodies corrode
• Ship hulls deteriorate
• Building iron bars weaken

Conditions Required for Rusting:
• Iron or steel (must contain Fe)
• Oxygen (from air)
• Water (moisture)
• All three are essential!

Experiment to Prove:
• Tube with water only → No rust
• Tube with oil over water (no O₂) → No rust
• Tube with dry air (no water) → No rust
• Tube with water and air → Rust forms (brown color)

2. TARNISHING:
• Silver reacts with sulfur compounds in air
• Forms dark black coating of Ag₂S
• Reduces shine and luster
• Gradual loss of brightness

3. GREEN PATINA ON COPPER:
• Copper reacts with moisture and CO₂
• Forms green copper carbonate coating
• CuCO₃ · Cu(OH)₂ (malachite)
• Protective layer that slows further corrosion

4. WHITE CORROSION ON ALUMINUM:
• Aluminum forms white Al₂O₃ layer
• This layer protects from further corrosion (passive)
• Resistant to rusting

FACTORS AFFECTING CORROSION RATE:

1. Temperature:
   • Higher temperature → Faster corrosion
   • Low temperature → Slower corrosion

2. Humidity:
   • High moisture → Faster rusting
   • Dry conditions → Slower corrosion

3. pH of Environment:
   • Acidic conditions → Faster corrosion
   • Neutral/basic → Slower corrosion

4. Presence of Salts:
   • Salt solutions (NaCl) → Much faster corrosion
   • Seawater causes rapid corrosion
   • De-icing salts accelerate corrosion

5. Surface Defects:
   • Scratches expose bare metal
   • Increases corrosion rate
   • Creates galvanic cells

METHODS TO PREVENT CORROSION:

1. COATING METHODS:
   a) Paint:
      • Forms barrier between metal and environment
      • Prevents oxygen and water contact
      • Example: House paint, vehicle paint

   b) Varnish and Enamel:
      • Similar to paint
      • Hard protective layer
      • Better for high-temperature uses

   c) Plastic Coating:
      • PVC coating on steel pipes
      • Plastic films
      • Waterproof protection

   d) Oil and Grease:
      • Thin oil layer
      • Prevents water contact
      • Used for machinery

2. GALVANIZATION (Most Important):
   Definition: Coating steel with a layer of zinc
   
   Process:
   • Steel immersed in molten zinc (840°C)
   • Zinc bonds metallurgically to steel
   • Creates zinc layer (20-100 μm thick)
   
   Why it Works:
   • Zinc is more reactive than iron (above in series)
   • Zinc gets oxidized first (sacrificial anode)
   • Protects underlying iron
   
   Applications:
   • Galvanized nails and screws
   • Water pipes
   • Roofing sheets
   • Wire fencing
   • Outdoor structures

3. ELECTROPLATING:
   • Coating with noble metals (Cu, Ni, Cr)
   • Using electrolysis
   • Thin protective layer
   • Example: Chrome-plated bumpers

4. ALLOYING:
   Definition: Mixing metals to create resistant alloys
   
   Examples:
   • Stainless Steel (Fe + Cr + Ni)
     - Chromium forms protective oxide layer
     - Highly resistant to corrosion
   • Monel (Ni + Cu): High resistance
   • Inconel: High-temperature resistance

5. CATHODIC PROTECTION:
   a) Sacrificial Anode:
      • Using more reactive metal (Zn)
      • Gets oxidized instead of main metal
      • Used in ships, pipelines
   
   b) Impressed Current:
      • External power source
      • Makes metal cathode
      • Prevents oxidation

6. SURFACE CLEANING AND MAINTENANCE:
   • Regular paint maintenance
   • Cleaning of salt deposits
   • Removing surface rust early
   • Protective wax coating for vehicles

7. ENVIRONMENTAL MEASURES:
   • Reducing air pollution
   • Controlling humidity (dehumidifiers)
   • Using corrosion inhibitors
   • Proper ventilation

COMPARISON TABLE:
[Prevention Method | Application | Cost | Durability]
Painting | General surfaces | Low | 5-10 years
Galvanization | Steel structures | Medium | 20-50 years
Stainless steel | Food equipment | High | 30+ years
Coating oils | Machinery | Low | 1-2 years
Electroplating | Decorative | High | 5-10 years`,
            order: 3,
            keyPoints: JSON.stringify([
              'Corrosion requires oxygen and moisture',
              'Iron requires water and oxygen to rust',
              'Temperature and pH affect corrosion rate',
              'Galvanization prevents steel corrosion',
              'Stainless steel resists corrosion'
            ]),
            resources: JSON.stringify([
              { title: 'Corrosion and Prevention', url: 'https://www.britannica.com/technology/corrosion' },
              { title: 'Rust Prevention Methods', url: 'https://www.byjus.com/chemistry/corrosion-and-rusting/' },
              { title: 'Galvanization Process', url: 'https://www.britannica.com/technology/galvanizing' }
            ])
          },
          {
            topic: 'Reactions of Metals and Non-metals',
            content: `REACTIONS OF METALS:

1. METALS WITH OXYGEN:
   General Pattern: Metal + Oxygen → Metal Oxide
   
   Reactivity Impact:
   • Very reactive metals (K, Na): Burn vigorously with bright flame
     • 4Na + O₂ → 2Na₂O (oxidation in air)
     • 2K + O₂ → K₂O₂ (produces peroxide)
   
   • Moderately reactive (Mg, Al, Fe):
     • 2Mg + O₂ → 2MgO (bright light, very hot)
     • 4Al + 3O₂ → 2Al₂O₃ (white smoke)
     • 3Fe + 2O₂ → Fe₃O₄ (black oxide forms)
   
   • Less reactive (Cu, Ag, Au):
     • 2Cu + O₂ → 2CuO (black coating)
     • Ag, Au don't readily oxidize

2. METALS WITH WATER:
   Alkali Metals:
   • 2Na + 2H₂O → 2NaOH + H₂↑ (vigorous, hydrogen catches fire)
   • 2K + 2H₂O → 2KOH + H₂↑ (more vigorous than Na)
   
   Alkaline Earth Metals:
   • Ca + 2H₂O → Ca(OH)₂ + H₂↑ (vigorous)
   • Mg + H₂O(steam) → MgO + H₂↑ (requires steam)
   
   Other Metals:
   • Fe, Zn, Al don't readily react with water
   • React with steam at high temperature
   • 3Fe + 4H₂O(steam) → Fe₃O₄ + 4H₂↑

3. METALS WITH ACIDS:
   General: Metal + Dilute Acid → Salt + Hydrogen Gas
   
   Very Reactive (K, Na):
   • React explosively (don't test!)
   
   Reactive Metals (Zn, Fe, Mg):
   • Zn + 2HCl → ZnCl₂ + H₂↑ (vigorous)
   • Fe + 2HCl → FeCl₂ + H₂↑
   • Mg + 2HCl → MgCl₂ + H₂↑
   
   Less Reactive (Cu, Ag, Au):
   • Don't react with dilute acids
   • Don't displace hydrogen (below hydrogen in series)
   • Require concentrated acids or oxidizing acids

4. METAL-METAL DISPLACEMENT:
   General: More Reactive Metal + Salt of Less Reactive → New Salt + Less Reactive Metal
   
   Examples:
   • Fe + CuSO₄ → FeSO₄ + Cu (copper displaced)
   • Zn + FeSO₄ → ZnSO₄ + Fe (iron displaced)
   • Al + ZnCl₂ → AlCl₃ + Zn (zinc displaced)

REACTIONS OF NON-METALS:

1. NON-METALS WITH OXYGEN:
   General Pattern: Non-metal + Oxygen → Non-metal Oxide
   
   Formation of Oxides:
   • 2H₂ + O₂ → 2H₂O (water forms, burns with pop sound)
   • S + O₂ → SO₂ (sulfurous smell)
   • 4P + 5O₂ → 2P₂O₅ (white smoke forms)
   • 2C + O₂ → 2CO (if limited oxygen)
   • C + O₂ → CO₂ (complete combustion)
   • N₂ + O₂ → 2NO (high temperature, lightning)
   
   Note: Most non-metallic oxides are acidic
   • SO₂ + H₂O → H₂SO₃ (forms acid)
   • CO₂ + H₂O → H₂CO₃ (forms acid)

2. NON-METALS WITH METALS:
   Pattern: Non-metal + Metal → Ionic Compound
   
   Examples:
   • Cl₂ + 2Na → 2NaCl (vigorous reaction, heat released)
   • O₂ + 2Na → Na₂O₂ (peroxide forms)
   • S + 2Na → Na₂S (sodium sulfide forms)
   • 2F₂ + 2H₂O → 4HF + O₂ (fluorine oxidizes water!)
   
   Trend: More reactive non-metals react more vigorously

3. NON-METALS WITH NON-METALS:
   Pattern: Non-metal + Non-metal → Covalent Compound
   
   Examples:
   • H₂ + Cl₂ → 2HCl (hydrogen chloride)
   • N₂ + 3H₂ ⇌ 2NH₃ (ammonia synthesis, Haber process)
   • P + 3F₂ → PF₃ (phosphorus trifluoride)
   • C + 2F₂ → CF₄ (carbon tetrafluoride)
   
   Note: These form covalent bonds, not ionic

4. REACTIVITY TREND IN NON-METALS:
   Most Reactive: F > Cl > Br > I (least reactive halogens)
   • Fluorine is the most reactive element overall
   • Can displace other halogens
   • F₂ + 2Cl⁻ → 2F⁻ + Cl₂

COMPARISON: METAL vs NON-METAL REACTIONS:

[Property | Metals | Non-metals]
Oxide Type | Basic | Acidic
Ion Formation | Cations | Anions
Electron Transfer | Lose | Gain
Bonding | Metallic/Ionic | Covalent/Ionic
Oxygen Reaction | Forms oxides | Forms oxides
Water Reaction | Some react vigorously | Few react
Acid Reaction | Some react | Don't react typically

KEY OBSERVATIONS:
• Reactivity series determines displacement ability
• Reactions release energy (usually exothermic)
• Observable signs: Heat, Light, Gas, Color change
• Some reactions are reversible (equilibrium)
• Temperature affects reaction rates and products`,
            order: 4,
            keyPoints: JSON.stringify([
              'Metals react with oxygen forming oxides',
              'Reactive metals react with water',
              'Metals displace less reactive metals',
              'Non-metals form acidic oxides',
              'Reactivity series predicts all reactions'
            ]),
            resources: JSON.stringify([
              { title: 'Reactions of Metals', url: 'https://www.byjus.com/chemistry/reactions-of-metals/' },
              { title: 'Reactions of Non-metals', url: 'https://www.vedantu.com/chemistry/reactions-of-non-metals' },
              { title: 'Metal-Non-metal Reactions', url: 'https://www.khanacademy.org/science/chemistry' }
            ])
          }
        ]
      },
      mcqs: {
        create: [
          {
            question: 'Which of the following is a property of metals?',
            optionA: 'Brittle',
            optionB: 'Lustrous',
            optionC: 'Poor conductor of electricity',
            optionD: 'Acidic oxides',
            correctOption: 'B',
            explanation: 'Metals are lustrous (shiny) and good conductors of electricity. Non-metals are brittle and form acidic oxides.',
            difficulty: 'easy',
            order: 1
          },
          {
            question: 'In the reactivity series, which metal is most reactive?',
            optionA: 'Copper',
            optionB: 'Iron',
            optionC: 'Potassium',
            optionD: 'Silver',
            correctOption: 'C',
            explanation: 'Potassium (K) is at the top of the reactivity series and is the most reactive metal. It must be stored under oil.',
            difficulty: 'medium',
            order: 2
          },
          {
            question: 'In the reaction: Fe + CuSO₄ → FeSO₄ + Cu, why does iron displace copper?',
            optionA: 'Iron is less reactive',
            optionB: 'Copper is more reactive',
            optionC: 'Iron is more reactive',
            optionD: 'They have similar reactivity',
            correctOption: 'C',
            explanation: 'Iron is more reactive than copper in the reactivity series, so it can displace copper from its salt solution.',
            difficulty: 'medium',
            order: 3
          },
          {
            question: 'What is the process of coating iron with zinc called?',
            optionA: 'Tarnishing',
            optionB: 'Galvanization',
            optionC: 'Alloying',
            optionD: 'Oxidation',
            correctOption: 'B',
            explanation: 'Galvanization is the process of coating steel/iron with zinc to prevent rusting by sacrificial protection.',
            difficulty: 'hard',
            order: 4
          },
          {
            question: 'Which non-metal conducts electricity?',
            optionA: 'Sulfur',
            optionB: 'Oxygen',
            optionC: 'Graphite',
            optionD: 'Chlorine',
            correctOption: 'C',
            explanation: 'Graphite is a form of carbon that is an exception among non-metals and conducts electricity due to delocalized electrons.',
            difficulty: 'hard',
            order: 5
          }
        ]
      }
    }
  })

  console.log('✅ Chapter 3: Metals and Non-metals (5 MCQs)')

  // ============================================================================
  // CHAPTER 4: COMPREHENSIVE CHEMISTRY ASSESSMENT (FINAL EXAM - 20 Questions)
  // ============================================================================
  console.log('📝 Creating Final Exam with 20 Comprehensive Questions...\n')
  
  void await prisma.chapter.create({
    data: {
      title: 'Comprehensive Chemistry Assessment - Final Exam',
      description: 'Final exam covering all chemistry topics: chemical reactions, acids/bases, and metals/non-metals. 20 comprehensive questions.',
      subject: 'Chemistry',
      classLevel: '10',
      order: 4,
      mcqs: {
        create: [
          // Chapter 1 based questions (Q1-Q5)
          {
            question: 'In the balanced equation 2H₂ + O₂ → 2H₂O, what is the ratio of H atoms to O atoms in the reactants?',
            optionA: '1:1',
            optionB: '2:2',
            optionC: '4:2',
            optionD: '2:1',
            correctOption: 'C',
            explanation: 'In reactants: 2H₂ has 4 H atoms, O₂ has 2 O atoms. Ratio = 4:2',
            difficulty: 'medium',
            order: 1
          },
          {
            question: 'Which type of reaction occurs when C burns in air to form CO₂?',
            optionA: 'Decomposition',
            optionB: 'Combination',
            optionC: 'Displacement',
            optionD: 'Double displacement',
            correctOption: 'B',
            explanation: 'Combination reaction: two substances (C and O₂) combine to form one product (CO₂)',
            difficulty: 'easy',
            order: 2
          },
          {
            question: 'What is the oxidation state of Cl in KClO₃?',
            optionA: '+5',
            optionB: '+6',
            optionC: '+4',
            optionD: '+3',
            correctOption: 'A',
            explanation: 'In KClO₃: K=+1, O=-2, so Cl must be +5 to make sum = 0',
            difficulty: 'hard',
            order: 3
          },
          {
            question: 'When CaCO₃ is heated, it decomposes. What are the products?',
            optionA: 'Ca and O₂',
            optionB: 'CaO and CO₂',
            optionC: 'Ca(OH)₂ and CO',
            optionD: 'CaCl and O',
            correctOption: 'B',
            explanation: 'Decomposition of calcium carbonate: CaCO₃ → CaO + CO₂',
            difficulty: 'medium',
            order: 4
          },
          {
            question: 'In a redox reaction, which element is the oxidizing agent?',
            optionA: 'The element that is oxidized',
            optionB: 'The element that is reduced',
            optionC: 'The element that gains electrons',
            optionD: 'The element that loses electrons',
            correctOption: 'C',
            explanation: 'Oxidizing agent is reduced (gains electrons). Reducing agent is oxidized (loses electrons)',
            difficulty: 'hard',
            order: 5
          },
          // Chapter 2 based questions (Q6-Q10)
          {
            question: 'Which of the following has the lowest pH?',
            optionA: 'Vinegar (pH 2)',
            optionB: 'Lemon juice (pH 2)',
            optionC: 'Pure water (pH 7)',
            optionD: 'Seawater (pH 8)',
            correctOption: 'A',
            explanation: 'Lower pH = more acidic. Both vinegar and lemon juice are pH 2, but vinegar is listed first',
            difficulty: 'easy',
            order: 6
          },
          {
            question: 'In a neutralization reaction, what is always produced along with the salt?',
            optionA: 'Oxygen',
            optionB: 'Hydrogen gas',
            optionC: 'Water',
            optionD: 'Ammonia',
            correctOption: 'C',
            explanation: 'General formula: Acid + Base → Salt + Water',
            difficulty: 'easy',
            order: 7
          },
          {
            question: 'Which indicator shows different colors in acid and base?',
            optionA: 'Only methyl orange',
            optionB: 'Only phenolphthalein',
            optionC: 'Both methyl orange and phenolphthalein',
            optionD: 'Only blue litmus',
            correctOption: 'C',
            explanation: 'Both are excellent indicators: Methyl orange (pink in acid, yellow in base), Phenolphthalein (colorless in acid, pink in base)',
            difficulty: 'medium',
            order: 8
          },
          {
            question: 'What happens when excess base is added to an acidic solution?',
            optionA: 'Solution becomes more acidic',
            optionB: 'Solution remains acidic',
            optionC: 'Solution becomes neutral then basic',
            optionD: 'Nothing happens',
            correctOption: 'C',
            explanation: 'Neutralization occurs gradually. First reaches pH 7 (neutral), then with excess base becomes basic (pH > 7)',
            difficulty: 'hard',
            order: 9
          },
          {
            question: 'Which of the following is a basic salt?',
            optionA: 'NaCl',
            optionB: 'KNO₃',
            optionC: 'Ca(OCl)₂',
            optionD: 'CuSO₄',
            correctOption: 'C',
            explanation: 'Calcium hypochlorite Ca(OCl)₂ is a basic salt (pH > 7) because it hydrolyzes to form basic solutions',
            difficulty: 'hard',
            order: 10
          },
          // Chapter 3 based questions (Q11-Q15)
          {
            question: 'Which metal is most reactive in the activity series?',
            optionA: 'Magnesium',
            optionB: 'Potassium',
            optionC: 'Iron',
            optionD: 'Copper',
            correctOption: 'B',
            explanation: 'Reactivity series: K > Na > Ca > Mg > Al > Zn > Fe > Cu. Potassium is at the top',
            difficulty: 'easy',
            order: 11
          },
          {
            question: 'Why does zinc coating prevent iron from rusting?',
            optionA: 'Zinc is less reactive than iron',
            optionB: 'Zinc is more reactive and acts as sacrificial anode',
            optionC: 'Zinc creates a waterproof barrier',
            optionD: 'Zinc reacts with oxygen instead of iron',
            correctOption: 'B',
            explanation: 'Galvanization: Zinc (higher in reactivity series) oxidizes first, protecting iron underneath',
            difficulty: 'medium',
            order: 12
          },
          {
            question: 'Which property is NOT typical of metals?',
            optionA: 'Ductility',
            optionB: 'Good conductor of electricity',
            optionC: 'Forms acidic oxides',
            optionD: 'Malleable',
            correctOption: 'C',
            explanation: 'Metals form BASIC oxides (e.g., Na₂O, MgO). Non-metals form acidic oxides (SO₂, CO₂)',
            difficulty: 'medium',
            order: 13
          },
          {
            question: 'In the reaction Fe + 2HCl → FeCl₂ + H₂, which element is reducing agent?',
            optionA: 'Fe',
            optionB: 'H',
            optionC: 'Cl',
            optionD: 'Fe and H',
            correctOption: 'A',
            explanation: 'Fe goes from 0 to +2 (oxidation). Fe loses electrons, so it is the reducing agent',
            difficulty: 'hard',
            order: 14
          },
          {
            question: 'Graphite conducts electricity while diamond does not. Both are forms of carbon. This is due to:',
            optionA: 'Different atomic mass',
            optionB: 'Different crystal structure and electron arrangement',
            optionC: 'Graphite is a metal',
            optionD: 'Diamond is a non-metal',
            correctOption: 'B',
            explanation: 'Graphite has delocalized electrons in layers allowing conductivity. Diamond has all electrons localized in covalent bonds',
            difficulty: 'hard',
            order: 15
          },
          // Mixed comprehensive questions (Q16-Q20)
          {
            question: 'A substance turns blue litmus red, conducts electricity, and reacts with Ca to produce H₂. It is:',
            optionA: 'A base',
            optionB: 'A metal',
            optionC: 'An acid',
            optionD: 'A salt',
            correctOption: 'C',
            explanation: 'Blue litmus turns red in acid, conducts in solution, and acids react with metals to produce H₂',
            difficulty: 'medium',
            order: 16
          },
          {
            question: 'When sodium reacts with water, hydrogen gas is produced and burns with a pop sound. The equation is:',
            optionA: '2Na + H₂O → 2NaOH + H₂',
            optionB: 'Na + H₂O → NaOH + H',
            optionC: '2Na + 2H₂O → 2NaOH + H₂',
            optionD: 'Na + H₂O → NaOH + H₂',
            correctOption: 'C',
            explanation: 'Balanced equation must have same atoms on both sides. Correct: 2Na + 2H₂O → 2NaOH + H₂',
            difficulty: 'medium',
            order: 17
          },
          {
            question: 'Which statement about strong and weak acids is correct?',
            optionA: 'Strong acids partially ionize, weak acids completely ionize',
            optionB: 'Strong acids completely ionize, weak acids partially ionize',
            optionC: 'Both ionize completely',
            optionD: 'Neither ionizes',
            correctOption: 'B',
            explanation: 'Strong acids (HCl, H₂SO₄) → 100% ionization. Weak acids (CH₃COOH) → partial ionization',
            difficulty: 'medium',
            order: 18
          },
          {
            question: 'A metal X displaces metal Y from YSO₄ solution. What can we conclude?',
            optionA: 'X is less reactive than Y',
            optionB: 'X is more reactive than Y',
            optionC: 'Y is more reactive than X',
            optionD: 'Both are equally reactive',
            correctOption: 'B',
            explanation: 'More reactive metal can displace less reactive metal. X displaces Y, so X is more reactive',
            difficulty: 'easy',
            order: 19
          },
          {
            question: 'Which combination would NOT produce a visible reaction?',
            optionA: 'Cu + AgNO₃ solution',
            optionB: 'Zn + CuSO₄ solution',
            optionC: 'Cu + ZnSO₄ solution',
            optionD: 'Fe + CuSO₄ solution',
            correctOption: 'C',
            explanation: 'Cu + ZnSO₄ → No reaction (Cu is below Zn in reactivity series). All others show reactions',
            difficulty: 'hard',
            order: 20
          }
        ]
      }
    }
  })

  console.log('✅ Final Exam: Comprehensive Chemistry Assessment (20 MCQs)')

  console.log('\n✨ Database seeding completed successfully!')
  console.log(`\n📊 Summary:
  • 4 Chapters created (3 Learning + 1 Final Exam)
  • 35 MCQs total (5 per learning chapter + 20 final exam)
  • Rich multimedia resources (diagrams, external links)
  • Detailed explanations and examples
  • Sample user: student@alfanumrik.com / password123
  
✅ FINAL EXAM: 20 Comprehensive Questions
  - Questions 1-5: Chemical Reactions & Equations
  - Questions 6-10: Acids, Bases & Salts
  - Questions 11-15: Metals & Non-metals
  - Questions 16-20: Mixed Comprehensive`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
