const grade = (grade: number, min: number, max: number, quantile?: number) => ({
  grade,
  min,
  max,
  quantile,
});

export const academic = [
  {
    institution: "Erzbischöfliche Liebfrauenschule",
    degree: "Abitur",
    grade: grade(1.3, 1.0, 4.0),
    date: [new Date(2011, 6), new Date(2019, 6)] as const,
  },
  {
    institution: "University of Cologne",
    degree: "B.Sc. Business Informatics",
    grade: grade(1.2, 1.0, 4.0, 0.025),
    date: [new Date(2019, 9), new Date(2022, 7)] as const,
    note: "Honorable mention - Graduated with best possible grade in bachelor thesis in collaboration with onpreo GmBH in applied machine learning topic (real estate appraisal)",
  },
];
