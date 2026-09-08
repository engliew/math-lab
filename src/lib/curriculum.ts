export type StageId =
  | "preschool"
  | "y1"
  | "y2"
  | "y3"
  | "y4"
  | "y5"
  | "y6";

export type Strand =
  | "Number"
  | "Geometry and Measure"
  | "Statistics and Probability";

export type Topic = {
  id: string;
  stageId: StageId;
  title: string;
  strand: Strand;
  code: string;
  summary: string;
  playable: boolean;
};

export type Stage = {
  id: StageId;
  title: string;
  ages: string;
  cambridge: string;
  blurb: string;
};

export const STAGES: Stage[] = [
  {
    id: "preschool",
    title: "Preschool",
    ages: "Age 5",
    cambridge: "Prior experience for Stage 1",
    blurb:
      "Early number talk, counting to 10, matching, simple shapes and everyday measures — the start Cambridge Primary expects before Year 1.",
  },
  {
    id: "y1",
    title: "Year 1",
    ages: "Ages 5–6",
    cambridge: "Cambridge Primary Stage 1",
    blurb:
      "Count to 20, add and take away, number bonds to 10, halves, time to the hour, and sorting 2D and 3D shapes.",
  },
  {
    id: "y2",
    title: "Year 2",
    ages: "Ages 6–7",
    cambridge: "Cambridge Primary Stage 2",
    blurb:
      "Numbers to 100, place value, arrays, sharing, 2/5/10 tables, halves and quarters, and time to five minutes.",
  },
  {
    id: "y3",
    title: "Year 3",
    ages: "Ages 7–8",
    cambridge: "Cambridge Primary Stage 3",
    blurb:
      "Numbers to 1000, 3-digit place value, times tables, unit fractions, money, perimeter, and right angles.",
  },
  {
    id: "y4",
    title: "Year 4",
    ages: "Ages 8–9",
    cambridge: "Cambridge Primary Stage 4",
    blurb:
      "Numbers beyond 1000, negatives, all tables, equivalent fractions, percentages, area, and first-quadrant coordinates.",
  },
  {
    id: "y5",
    title: "Year 5",
    ages: "Ages 9–10",
    cambridge: "Cambridge Primary Stage 5",
    blurb:
      "Decimals (tenths and hundredths), order of operations, ratio, percentages, volume, and mode and median.",
  },
  {
    id: "y6",
    title: "Year 6",
    ages: "Ages 10–12",
    cambridge: "Cambridge Primary Stage 6",
    blurb:
      "Thousandths, fractions/decimals/percentages, ratio, area of triangles, pie charts, and mean and range.",
  },
];

function t(
  partial: Omit<Topic, "playable"> & { playable?: boolean },
): Topic {
  return { playable: false, ...partial };
}

/**
 * Ordered Math Lab path: Preschool → Year 6.
 * Codes for Y1–Y6 follow Cambridge Primary Mathematics 0096 (2020, v1.1).
 * Preschool codes (EY.*) summarise the official “Prior experience for Stage 1”.
 */
export const TOPICS: Topic[] = [
  t({
    id: "ps-count-1-10",
    stageId: "preschool",
    title: "Counting objects 1 to 10",
    strand: "Number",
    code: "EY.Nc.01",
    summary:
      "Touch-count a set, know the last number names the whole set, and read how many (1–10).",
    playable: true,
  }),
  t({
    id: "ps-next-number",
    stageId: "preschool",
    title: "Which number comes next?",
    strand: "Number",
    code: "EY.Nc.02",
    summary: "Say the next number and the number before when counting from 1 to 10.",
  }),
  t({
    id: "ps-recognise-1-10",
    stageId: "preschool",
    title: "Recognising numerals 1 to 10",
    strand: "Number",
    code: "EY.Ni.01",
    summary: "Spot and name numerals at home, in class, and in the community.",
  }),
  t({
    id: "ps-one-to-one",
    stageId: "preschool",
    title: "One-to-one matching",
    strand: "Number",
    code: "EY.Nc.03",
    summary: "Match each object to one count so none are skipped or counted twice.",
  }),
  t({
    id: "ps-sharing-two",
    stageId: "preschool",
    title: "Sharing into two groups",
    strand: "Number",
    code: "EY.Nf.01",
    summary: "Share objects into two equal groups in play.",
  }),
  t({
    id: "ps-repeating-patterns",
    stageId: "preschool",
    title: "Repeating patterns",
    strand: "Number",
    code: "EY.Nc.04",
    summary: "Copy and continue simple colour or shape patterns and say what comes next.",
  }),
  t({
    id: "ps-2d-shapes",
    stageId: "preschool",
    title: "Naming 2D shapes",
    strand: "Geometry and Measure",
    code: "EY.Gg.01",
    summary: "Name and sort common flat shapes found at home and school.",
  }),
  t({
    id: "ps-compare-size",
    stageId: "preschool",
    title: "Longer, shorter, taller",
    strand: "Geometry and Measure",
    code: "EY.Gg.02",
    summary: "Compare length and mass with words such as longer, shorter, heavier, lighter.",
  }),
  t({
    id: "ps-days-and-times",
    stageId: "preschool",
    title: "Days and times of day",
    strand: "Geometry and Measure",
    code: "EY.Gt.01",
    summary: "Name days of the week and talk about yesterday, today, tomorrow, morning and evening.",
  }),
  t({
    id: "ps-picture-collections",
    stageId: "preschool",
    title: "Picture collections",
    strand: "Statistics and Probability",
    code: "EY.Ss.01",
    summary: "Show and read simple pictorial collections of objects.",
  }),

  t({
    id: "y1-count-0-20",
    stageId: "y1",
    title: "Count objects 0 to 20",
    strand: "Number",
    code: "1Nc.01",
    summary: "Count objects from 0 to 20 with one-to-one correspondence and conservation of number.",
  }),
  t({
    id: "y1-count-on-back",
    stageId: "y1",
    title: "Count on and back to 20",
    strand: "Number",
    code: "1Nc.04",
    summary: "Count on in ones, twos or tens, and count back in ones and tens, from 0 to 20.",
  }),
  t({
    id: "y1-even-odd",
    stageId: "y1",
    title: "Even and odd to 20",
    strand: "Number",
    code: "1Nc.05",
    summary: "See even and odd numbers as every other number when counting from 0 to 20.",
  }),
  t({
    id: "y1-read-write-20",
    stageId: "y1",
    title: "Read and write numbers 0–20",
    strand: "Number",
    code: "1Ni.01",
    summary: "Recite, read and write number names and whole numbers from 0 to 20.",
  }),
  t({
    id: "y1-addition",
    stageId: "y1",
    title: "Addition by combining",
    strand: "Number",
    code: "1Ni.02",
    summary: "Understand addition as counting on and as combining two sets (answers 0–20).",
  }),
  t({
    id: "y1-subtraction",
    stageId: "y1",
    title: "Subtraction as take away",
    strand: "Number",
    code: "1Ni.03",
    summary: "Understand subtraction as counting back, take away, and difference.",
  }),
  t({
    id: "y1-bonds-10",
    stageId: "y1",
    title: "Number bonds to 10",
    strand: "Number",
    code: "1Ni.04",
    summary: "Recognise complements of 10.",
  }),
  t({
    id: "y1-doubles",
    stageId: "y1",
    title: "Doubles to 10",
    strand: "Number",
    code: "1Ni.06",
    summary: "Know doubles up to double 10.",
  }),
  t({
    id: "y1-zero",
    stageId: "y1",
    title: "Zero means none",
    strand: "Number",
    code: "1Np.01",
    summary: "Understand that zero represents none of something.",
  }),
  t({
    id: "y1-compare-20",
    stageId: "y1",
    title: "Compare and order 0–20",
    strand: "Number",
    code: "1Np.03",
    summary: "Compare and order numbers from 0 to 20 by relative size.",
  }),
  t({
    id: "y1-ordinals",
    stageId: "y1",
    title: "Ordinal numbers 1st to 10th",
    strand: "Number",
    code: "1Np.04",
    summary: "Recognise and use ordinal numbers from 1st to 10th.",
  }),
  t({
    id: "y1-halves",
    stageId: "y1",
    title: "Halves of shapes and groups",
    strand: "Number",
    code: "1Nf.02",
    summary: "A half is one of two equal parts of a shape, quantity or set.",
  }),
  t({
    id: "y1-time-hour",
    stageId: "y1",
    title: "Time to the hour and half hour",
    strand: "Geometry and Measure",
    code: "1Gt.03",
    summary: "Recognise time to the hour and half hour.",
  }),
  t({
    id: "y1-days-months",
    stageId: "y1",
    title: "Days and months",
    strand: "Geometry and Measure",
    code: "1Gt.02",
    summary: "Know the days of the week and the months of the year.",
  }),
  t({
    id: "y1-2d-shapes",
    stageId: "y1",
    title: "2D shapes",
    strand: "Geometry and Measure",
    code: "1Gg.01",
    summary: "Identify, describe and sort 2D shapes by sides — curved or straight.",
  }),
  t({
    id: "y1-3d-shapes",
    stageId: "y1",
    title: "3D shapes",
    strand: "Geometry and Measure",
    code: "1Gg.03",
    summary: "Identify, describe and sort 3D shapes by faces, edges, flat or curved.",
  }),
  t({
    id: "y1-position",
    stageId: "y1",
    title: "Position and direction",
    strand: "Geometry and Measure",
    code: "1Gp.01",
    summary: "Use familiar language to describe position and direction.",
  }),
  t({
    id: "y1-pictograms",
    stageId: "y1",
    title: "Pictograms: more and less",
    strand: "Statistics and Probability",
    code: "1Ss.03",
    summary: "Read simple pictograms and block graphs using more, less, most and least.",
  }),

  t({
    id: "y2-count-100",
    stageId: "y2",
    title: "Count to 100",
    strand: "Number",
    code: "2Nc.01",
    summary: "Count objects from 0 to 100, grouping in twos, fives or tens.",
  }),
  t({
    id: "y2-count-steps",
    stageId: "y2",
    title: "Count in 2s, 5s and 10s",
    strand: "Number",
    code: "2Nc.04",
    summary: "Count on and back in ones, twos, fives or tens from any number to 100.",
  }),
  t({
    id: "y2-even-odd-100",
    stageId: "y2",
    title: "Even and odd to 100",
    strand: "Number",
    code: "2Nc.05",
    summary: "Recognise the characteristics of even and odd numbers from 0 to 100.",
  }),
  t({
    id: "y2-add-subtract",
    stageId: "y2",
    title: "Add and subtract 2-digit numbers",
    strand: "Number",
    code: "2Ni.04",
    summary: "Estimate, add and subtract whole numbers with up to two digits (no regrouping).",
  }),
  t({
    id: "y2-bonds-20",
    stageId: "y2",
    title: "Number bonds to 20",
    strand: "Number",
    code: "2Ni.03",
    summary: "Recognise complements of 20 and complements of multiples of 10 up to 100.",
  }),
  t({
    id: "y2-arrays",
    stageId: "y2",
    title: "Multiplication as arrays",
    strand: "Number",
    code: "2Ni.05",
    summary: "Understand multiplication as repeated addition and as an array.",
  }),
  t({
    id: "y2-sharing",
    stageId: "y2",
    title: "Division as sharing and grouping",
    strand: "Number",
    code: "2Ni.06",
    summary: "Understand division as sharing (items per group) and grouping (number of groups).",
  }),
  t({
    id: "y2-tables-2-5-10",
    stageId: "y2",
    title: "2, 5 and 10 times tables",
    strand: "Number",
    code: "2Ni.07",
    summary: "Know the 1, 2, 5 and 10 times tables.",
  }),
  t({
    id: "y2-place-value",
    stageId: "y2",
    title: "2-digit place value",
    strand: "Number",
    code: "2Np.01",
    summary: "The value of each digit in a 2-digit number depends on its place; zero is a placeholder.",
  }),
  t({
    id: "y2-round-10",
    stageId: "y2",
    title: "Round to the nearest 10",
    strand: "Number",
    code: "2Np.05",
    summary: "Round 2-digit numbers to the nearest 10.",
  }),
  t({
    id: "y2-halves-quarters",
    stageId: "y2",
    title: "Halves and quarters",
    strand: "Number",
    code: "2Nf.05",
    summary: "Compare 1/4, 1/2, 3/4 and 1, and see that 1/2 = 2/4.",
  }),
  t({
    id: "y2-time-5",
    stageId: "y2",
    title: "Time to five minutes",
    strand: "Geometry and Measure",
    code: "2Gt.02",
    summary: "Read and record time to five minutes on analogue clocks and in 12-hour digital notation.",
  }),
  t({
    id: "y2-length",
    stageId: "y2",
    title: "Measuring length",
    strand: "Geometry and Measure",
    code: "2Gg.03",
    summary: "Estimate and measure lengths using non-standard or standard units.",
  }),
  t({
    id: "y2-symmetry",
    stageId: "y2",
    title: "Line symmetry",
    strand: "Geometry and Measure",
    code: "2Gg.09",
    summary: "Identify a horizontal or vertical line of symmetry on 2D shapes and patterns.",
  }),
  t({
    id: "y2-turns",
    stageId: "y2",
    title: "Whole, half and quarter turns",
    strand: "Geometry and Measure",
    code: "2Gg.11",
    summary: "An angle is a turn — whole, half and quarter, clockwise or anticlockwise.",
  }),
  t({
    id: "y2-tally",
    stageId: "y2",
    title: "Tally charts and pictograms",
    strand: "Statistics and Probability",
    code: "2Ss.02",
    summary: "Record categorical data in lists, tallies, block graphs and pictograms.",
  }),
  t({
    id: "y2-chance",
    stageId: "y2",
    title: "Chance: two outcomes",
    strand: "Statistics and Probability",
    code: "2Sp.02",
    summary: "Conduct chance experiments with two outcomes and describe the results.",
  }),

  t({
    id: "y3-count-1000",
    stageId: "y3",
    title: "Count to 1000",
    strand: "Number",
    code: "3Nc.02",
    summary: "Count on and back in 1-digit steps, tens or hundreds from any number to 1000.",
  }),
  t({
    id: "y3-read-1000",
    stageId: "y3",
    title: "Read and write numbers to 1000",
    strand: "Number",
    code: "3Ni.01",
    summary: "Recite, read and write number names and whole numbers from 0 to 1000.",
  }),
  t({
    id: "y3-add-subtract-3",
    stageId: "y3",
    title: "Add and subtract 3-digit numbers",
    strand: "Number",
    code: "3Ni.04",
    summary: "Estimate, add and subtract whole numbers with up to three digits, including regrouping.",
  }),
  t({
    id: "y3-bonds-100",
    stageId: "y3",
    title: "Complements of 100",
    strand: "Number",
    code: "3Ni.03",
    summary: "Recognise complements of 100 and of multiples of 10 or 100 up to 1000.",
  }),
  t({
    id: "y3-tables",
    stageId: "y3",
    title: "Times tables to 10 (most facts)",
    strand: "Number",
    code: "3Ni.07",
    summary: "Know the 1, 2, 3, 4, 5, 6, 8, 9 and 10 times tables.",
  }),
  t({
    id: "y3-multiply-divide",
    stageId: "y3",
    title: "Multiply and divide within 100",
    strand: "Number",
    code: "3Ni.08",
    summary: "Estimate and multiply or divide whole numbers up to 100 by 2, 3, 4 and 5.",
  }),
  t({
    id: "y3-place-value-3",
    stageId: "y3",
    title: "3-digit place value",
    strand: "Number",
    code: "3Np.01",
    summary: "The value of each digit is determined by its position (hundreds, tens, ones).",
  }),
  t({
    id: "y3-round-10-100",
    stageId: "y3",
    title: "Round to 10 or 100",
    strand: "Number",
    code: "3Np.05",
    summary: "Round 3-digit numbers to the nearest 10 or 100.",
  }),
  t({
    id: "y3-unit-fractions",
    stageId: "y3",
    title: "Unit fractions as operators",
    strand: "Number",
    code: "3Nf.05",
    summary: "Halves, quarters, three-quarters, thirds and tenths acting on a quantity.",
  }),
  t({
    id: "y3-equivalent-fractions",
    stageId: "y3",
    title: "Equivalent fractions",
    strand: "Number",
    code: "3Nf.06",
    summary: "Recognise that two fractions can have an equivalent value (halves, quarters, fifths, tenths).",
  }),
  t({
    id: "y3-money",
    stageId: "y3",
    title: "Money and change",
    strand: "Number",
    code: "3Nm.02",
    summary: "Add and subtract amounts of money to give change, using decimal money notation.",
  }),
  t({
    id: "y3-time-interval",
    stageId: "y3",
    title: "Time and time intervals",
    strand: "Geometry and Measure",
    code: "3Gt.04",
    summary: "Tell the difference between a time and a time interval; find intervals in days to years.",
  }),
  t({
    id: "y3-perimeter",
    stageId: "y3",
    title: "Perimeter and area on a grid",
    strand: "Geometry and Measure",
    code: "3Gg.03",
    summary: "Perimeter is the distance around a shape; area is the space inside, counted on a square grid.",
  }),
  t({
    id: "y3-right-angles",
    stageId: "y3",
    title: "Right angles and half turns",
    strand: "Geometry and Measure",
    code: "3Gg.10",
    summary: "Compare angles with a right angle; a straight line is two right angles or a half turn.",
  }),
  t({
    id: "y3-bar-charts",
    stageId: "y3",
    title: "Bar charts and pictograms",
    strand: "Statistics and Probability",
    code: "3Ss.02",
    summary: "Represent categorical and discrete data in tallies, pictograms and bar charts.",
  }),
  t({
    id: "y3-chance-language",
    stageId: "y3",
    title: "It might happen",
    strand: "Statistics and Probability",
    code: "3Sp.01",
    summary: "Describe events as it will happen, it will not happen, or it might happen.",
  }),

  t({
    id: "y4-count-negatives",
    stageId: "y4",
    title: "Count through zero",
    strand: "Number",
    code: "4Nc.01",
    summary: "Count on and back in constant steps, extending beyond zero to negative numbers.",
  }),
  t({
    id: "y4-numbers-beyond-1000",
    stageId: "y4",
    title: "Numbers greater than 1000",
    strand: "Number",
    code: "4Ni.01",
    summary: "Read and write number names and whole numbers greater than 1000 and less than 0.",
  }),
  t({
    id: "y4-all-tables",
    stageId: "y4",
    title: "All times tables 1 to 10",
    strand: "Number",
    code: "4Ni.04",
    summary: "Know all times tables from 1 to 10.",
  }),
  t({
    id: "y4-factors-multiples",
    stageId: "y4",
    title: "Factors, multiples and tests of divisibility",
    strand: "Number",
    code: "4Ni.07",
    summary: "Relate multiples and factors; tests of divisibility by 2, 5, 10, 25, 50 and 100.",
  }),
  t({
    id: "y4-place-value",
    stageId: "y4",
    title: "Place value in larger numbers",
    strand: "Number",
    code: "4Np.01",
    summary: "Explain the value of each digit by its position; multiply and divide by 10 and 100.",
  }),
  t({
    id: "y4-round-large",
    stageId: "y4",
    title: "Rounding large numbers",
    strand: "Number",
    code: "4Np.05",
    summary: "Round numbers to the nearest 10, 100, 1000, 10 000 or 100 000.",
  }),
  t({
    id: "y4-equivalent-fractions",
    stageId: "y4",
    title: "Equivalent proper fractions",
    strand: "Number",
    code: "4Nf.04",
    summary: "Recognise that two proper fractions can have an equivalent value.",
  }),
  t({
    id: "y4-percentages",
    stageId: "y4",
    title: "Percentages as parts per 100",
    strand: "Number",
    code: "4Nf.06",
    summary: "Understand percentage as the number of parts in each hundred, and use %.",
  }),
  t({
    id: "y4-area-perimeter",
    stageId: "y4",
    title: "Area and perimeter of rectangles",
    strand: "Geometry and Measure",
    code: "4Gg.03",
    summary: "Derive and use formulae for the area and perimeter of rectangles and squares.",
  }),
  t({
    id: "y4-angles",
    stageId: "y4",
    title: "Acute, right and obtuse angles",
    strand: "Geometry and Measure",
    code: "4Gg.08",
    summary: "Estimate, compare and classify angles using acute, right and obtuse.",
  }),
  t({
    id: "y4-coordinates",
    stageId: "y4",
    title: "Coordinates in the first quadrant",
    strand: "Geometry and Measure",
    code: "4Gp.02",
    summary: "Read and plot coordinates in the first quadrant on a grid.",
  }),
  t({
    id: "y4-24-hour",
    stageId: "y4",
    title: "12-hour and 24-hour time",
    strand: "Geometry and Measure",
    code: "4Gt.02",
    summary: "Read and record time in 12- and 24-hour digital notation and on analogue clocks.",
  }),
  t({
    id: "y4-dot-plots",
    stageId: "y4",
    title: "Dot plots and bar charts",
    strand: "Statistics and Probability",
    code: "4Ss.02",
    summary: "Represent categorical and discrete data, including dot plots (one dot per count).",
  }),
  t({
    id: "y4-likely-certain",
    stageId: "y4",
    title: "Likely, certain, impossible",
    strand: "Statistics and Probability",
    code: "4Sp.01",
    summary: "Describe familiar events as maybe, likely, certain or impossible.",
  }),

  t({
    id: "y5-negative-integers",
    stageId: "y5",
    title: "Add and subtract integers",
    strand: "Number",
    code: "5Ni.01",
    summary: "Estimate, add and subtract integers, including where one integer is negative.",
  }),
  t({
    id: "y5-order-operations",
    stageId: "y5",
    title: "Order of operations",
    strand: "Number",
    code: "5Ni.03",
    summary: "Understand that the four operations follow a particular order.",
  }),
  t({
    id: "y5-primes",
    stageId: "y5",
    title: "Prime and composite numbers",
    strand: "Number",
    code: "5Ni.06",
    summary: "Explain the difference between prime and composite numbers.",
  }),
  t({
    id: "y5-square-numbers",
    stageId: "y5",
    title: "Square numbers to 100",
    strand: "Number",
    code: "5Ni.08",
    summary: "Recognise square numbers from 1 to 100.",
  }),
  t({
    id: "y5-decimal-place-value",
    stageId: "y5",
    title: "Decimal place value (tenths, hundredths)",
    strand: "Number",
    code: "5Np.01",
    summary: "Explain the value of each digit in decimals with tenths and hundredths.",
  }),
  t({
    id: "y5-multiply-10-100-1000",
    stageId: "y5",
    title: "Multiply and divide by 10, 100, 1000",
    strand: "Number",
    code: "5Np.02",
    summary: "Use place value to multiply and divide wholes and decimals by 10, 100 and 1000.",
  }),
  t({
    id: "y5-fdp",
    stageId: "y5",
    title: "Fractions, decimals and percentages",
    strand: "Number",
    code: "5Nf.04",
    summary: "Recognise equivalent values among proper fractions, 1 d.p. decimals and percentages.",
  }),
  t({
    id: "y5-ratio-proportion",
    stageId: "y5",
    title: "Ratio and proportion",
    strand: "Number",
    code: "5Nf.11",
    summary: "A proportion compares part to whole; a ratio compares part to part.",
  }),
  t({
    id: "y5-triangles",
    stageId: "y5",
    title: "Types of triangle",
    strand: "Geometry and Measure",
    code: "5Gg.01",
    summary: "Classify isosceles, equilateral and scalene triangles by angles and symmetry.",
  }),
  t({
    id: "y5-compound-area",
    stageId: "y5",
    title: "Compound area and perimeter",
    strand: "Geometry and Measure",
    code: "5Gg.03",
    summary: "Calculate perimeter and area of compound shapes made from rectangles.",
  }),
  t({
    id: "y5-angles-line",
    stageId: "y5",
    title: "Angles on a straight line",
    strand: "Geometry and Measure",
    code: "5Gg.08",
    summary: "The sum of angles on a straight line is 180°; find a missing angle.",
  }),
  t({
    id: "y5-translate-reflect",
    stageId: "y5",
    title: "Translate and reflect shapes",
    strand: "Geometry and Measure",
    code: "5Gp.03",
    summary: "Translate 2D shapes and reflect them in horizontal or vertical mirror lines.",
  }),
  t({
    id: "y5-mode-median",
    stageId: "y5",
    title: "Mode and median",
    strand: "Statistics and Probability",
    code: "5Ss.03",
    summary: "Find and interpret the mode and the median, and judge which fits the context.",
  }),
  t({
    id: "y5-equally-likely",
    stageId: "y5",
    title: "Equally likely outcomes",
    strand: "Statistics and Probability",
    code: "5Sp.02",
    summary: "Recognise outcomes that are equally likely, more likely or less likely.",
  }),

  t({
    id: "y6-letters-unknowns",
    stageId: "y6",
    title: "Letters for unknown quantities",
    strand: "Number",
    code: "6Nc.02",
    summary: "Use letters to represent quantities that vary in addition and subtraction.",
  }),
  t({
    id: "y6-brackets",
    stageId: "y6",
    title: "Brackets and order of operations",
    strand: "Number",
    code: "6Ni.03",
    summary: "Brackets can alter the order of operations; use the laws of arithmetic.",
  }),
  t({
    id: "y6-cube-numbers",
    stageId: "y6",
    title: "Cube numbers to 125",
    strand: "Number",
    code: "6Ni.08",
    summary: "Recognise cube numbers from 1 to 125.",
  }),
  t({
    id: "y6-thousandths",
    stageId: "y6",
    title: "Decimal thousandths",
    strand: "Number",
    code: "6Np.01",
    summary: "Explain the value of each digit in decimals: tenths, hundredths and thousandths.",
  }),
  t({
    id: "y6-simplify-fractions",
    stageId: "y6",
    title: "Fractions in simplest form",
    strand: "Number",
    code: "6Nf.03",
    summary: "Use equivalence to write fractions in their simplest form.",
  }),
  t({
    id: "y6-fdp-two-dp",
    stageId: "y6",
    title: "Fractions, decimals (2 d.p.) and percentages",
    strand: "Number",
    code: "6Nf.04",
    summary: "Match equivalent fractions, 1- or 2-decimal-place decimals, and percentages.",
  }),
  t({
    id: "y6-percentages",
    stageId: "y6",
    title: "Percentages of amounts",
    strand: "Number",
    code: "6Nf.07",
    summary: "Find 1% and multiples of 5% of shapes and whole numbers.",
  }),
  t({
    id: "y6-ratio",
    stageId: "y6",
    title: "Equivalent ratios and direct proportion",
    strand: "Number",
    code: "6Nf.13",
    summary: "Use equivalent ratios and the relationship of quantities in direct proportion.",
  }),
  t({
    id: "y6-triangle-area",
    stageId: "y6",
    title: "Area of right-angled triangles",
    strand: "Geometry and Measure",
    code: "6Gg.03",
    summary: "Use the area of rectangles to calculate the area of right-angled triangles.",
  }),
  t({
    id: "y6-volume-capacity",
    stageId: "y6",
    title: "Volume and capacity",
    strand: "Geometry and Measure",
    code: "6Gg.05",
    summary: "Understand the difference between capacity and volume.",
  }),
  t({
    id: "y6-angles-triangle",
    stageId: "y6",
    title: "Angles in a triangle",
    strand: "Geometry and Measure",
    code: "6Gg.10",
    summary: "The sum of angles in a triangle is 180°; find a missing angle.",
  }),
  t({
    id: "y6-four-quadrants",
    stageId: "y6",
    title: "Coordinates in four quadrants",
    strand: "Geometry and Measure",
    code: "6Gp.01",
    summary: "Read and plot coordinates, including fractions and decimals, in all four quadrants.",
  }),
  t({
    id: "y6-mean-range",
    stageId: "y6",
    title: "Mean, median, mode and range",
    strand: "Statistics and Probability",
    code: "6Ss.03",
    summary: "Find and interpret the mode (including bimodal), median, mean and range.",
  }),
  t({
    id: "y6-pie-charts",
    stageId: "y6",
    title: "Pie charts and scatter graphs",
    strand: "Statistics and Probability",
    code: "6Ss.02",
    summary: "Choose representations including pie charts, line graphs and scatter graphs.",
  }),
  t({
    id: "y6-probability",
    stageId: "y6",
    title: "Probability language and exclusive events",
    strand: "Statistics and Probability",
    code: "6Sp.02",
    summary: "Compare possible outcomes; know when two events are mutually exclusive.",
  }),
];

export const FIRST_TOPIC_ID = TOPICS[0]!.id;

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((topic) => topic.id === id);
}

export function getTopicIndex(id: string): number {
  return TOPICS.findIndex((topic) => topic.id === id);
}

export function getNextTopic(id: string): Topic | undefined {
  const index = getTopicIndex(id);
  if (index < 0 || index >= TOPICS.length - 1) return undefined;
  return TOPICS[index + 1];
}

export function topicsForStage(stageId: StageId): Topic[] {
  return TOPICS.filter((topic) => topic.stageId === stageId);
}

export function getStage(id: StageId): Stage {
  return STAGES.find((stage) => stage.id === id)!;
}
