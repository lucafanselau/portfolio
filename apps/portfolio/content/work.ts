export const work = [
  {
    company: "Tesla, Inc",
    motto: "Accelerating the world's transition to sustainable energy",
    position: "Automation Engineer Internship",
    link: "https://www.tesla.com/",
    date: [new Date(2023, 3), new Date(2023, 8)] as const,
    bullets: [
      "Internship as Automation Engineer in Giga Factory Berlin / Brandenburg",
      "Working on internal tooling to support large scale Drive Unit Fabrication",
    ],
  },
  {
    company: "onpreo GmbH",
    motto: "Modern acquisition solution for real estate brokers",
    position: "Working Student - Full Stack Software Engineer",
    link: "https://www.onpreo.com/",
    date: [new Date(2022, 0), new Date(2023, 2)] as const,
    bullets: [
      "Reviewed and Published Code Changes for Production Environment and Setup of Deployment and Database Infrastructure",
      "Implemented Integrations to large Real Estate broker platforms by reverse engineering proprietary data exchange formats",
    ],
  },
  {
    company: "smashleads™",
    motto: "Intelligent forms & funnels for lead generation",
    position: "Working Student - Full Stack Software Engineer",
    link: "https://smashleads.de/",
    date: [new Date(2019, 10), new Date(2021, 11)] as const,
    bullets: [
      "Worked as Full-Stack Developer using a modern Web Development Stack (MongoDB, React, Express, Next.js, Redux, Material UI) in an fast paced Startup Environment",
      "Responsible for the Conception, Design, Implementation and Deployment of complex features such as Statistics Dashboard Drag and Drop Landingpage Builder or interactive SVG graphics",
      "Implemented E2E, Integration and Unit Tests for the Code Base and refactored large parts into a modern monorepo design",
    ],
  },
];
