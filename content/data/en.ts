import type { Content } from "../types"

export default {
  profile: {
    role: "Mobile Engineer",
    location: "Turin, Italy",
    bio: "Mobile Engineer based in Turin, in the Platform team at TheFork. I build iOS apps with Swift and SwiftUI, with a soft spot for Clean Code and carefully crafted UI. Every now and then I also work on web development, just to keep things interesting.",
  },
  skills: [
    "Swift",
    "SwiftUI",
    "UIKit",
    "Swift Concurrency",
    "Combine",
    "SPM",
    "Clean Architecture",
    "SOLID",
    "TDD",
    "Fastlane",
    "CI/CD",
    "Datadog",
    "GraphQL",
    "React.js",
    "Next.js",
    "TypeScript",
    "React Native",
  ],
  work: [
    {
      title: "Mobile Engineer II, iOS – Platform team",
      organization: "TheFork (Tripadvisor group)",
      period: "Apr 2026 – Present",
      description:
        "In the Platform team I work on the foundations of the TheFork iOS app: navigation architecture, app lifecycle and modularization. I take care of upgrades to new iOS and Xcode versions and maintain the tools behind the team's daily work, such as SwiftLint, SwiftFormat and GitHub Actions pipelines.",
      tags: ["Swift", "SwiftUI", "Xcode", "GitHub Actions"],
    },
    {
      title: "Consultant Mid iOS Engineer – Insurance Platforms",
      organization: "Iriscube Reply",
      period: "Apr 2023 – Apr 2026",
      description:
        "I was the reference iOS developer for the Intesa Sanpaolo Assicurazioni app: I worked with business stakeholders on requirements, delivered features from design to production release, managed the CI/CD pipeline and mentored junior developers.",
      tags: ["Swift", "UIKit", "SwiftUI", "Intesa Sanpaolo"],
    },
    {
      title: "Consultant – iOS Customer Service",
      organization: "Iriscube Reply",
      period: "Jun 2022 – Nov 2023",
      description:
        "I contributed to the architecture and development of the Customer Service area in the new isybank app, integrating chatbot and screen-sharing SDKs for in-app support, and evolved it in the Intesa Sanpaolo app as well.",
      tags: ["Swift", "UIKit", "isybank", "Intesa Sanpaolo"],
    },
    {
      title: "Thesis Intern",
      organization: "Enhancers S.p.A.",
      period: "Mar 2022 – May 2022",
      description:
        "As part of my master's thesis, I built features for a connected oven and the hOn smart home app with React Native and TypeScript, to improve everyday interaction with the oven.",
      tags: ["React Native", "TypeScript", "IoT"],
    },
    {
      title: "IT Consultant",
      organization: "JEToP – Junior Enterprise",
      organizationUrl: "https://www.linkedin.com/company/j-e-to-p-/",
      period: "Feb 2022 – Jun 2022",
      description:
        "Part-time consulting at JEToP, the Junior Enterprise of Politecnico di Torino: I managed software projects for external clients alongside my studies.",
      tags: [],
    },
    {
      title: "IT Assistant",
      organization: "JEToP – Junior Enterprise",
      organizationUrl: "https://www.linkedin.com/company/j-e-to-p-/",
      period: "Nov 2021 – Feb 2022",
      description:
        "My first role at JEToP, the Junior Enterprise of Politecnico di Torino: I supported project teams and maintained the internal digital tools.",
      tags: [],
    },
  ],
  apps: [
    {
      name: "TheFork",
      context: "Tripadvisor group · Platform team",
      icon: "/apps/thefork.png",
      url: "https://apps.apple.com/it/app/thefork-ristoranti-e-offerte/id424850908",
    },
    {
      name: "Intesa Sanpaolo Assicurazioni",
      context: "Iriscube Reply · Insurance platforms",
      icon: "/apps/intesa-assicurazioni.png",
      url: "https://apps.apple.com/it/app/intesa-sanpaolo-assicurazioni/id1536788032",
    },
    {
      name: "isybank",
      context: "Iriscube Reply · Customer Service",
      icon: "/apps/isybank.png",
      url: "https://apps.apple.com/it/app/isybank/id1666218772",
    },
    {
      name: "Intesa Sanpaolo",
      context: "Iriscube Reply · Customer Service",
      icon: "/apps/intesa-sanpaolo.png",
      url: "https://apps.apple.com/it/app/intesa-sanpaolo-mobile/id597360475",
    },
    {
      name: "hOn",
      context: "Enhancers S.p.A. · Candy Hoover (Haier)",
      icon: "/apps/hon.png",
      url: "https://apps.apple.com/it/app/hon/id1500597674",
      showcase: false,
    },
  ],
  courses: [
    {
      title: "Swift Concurrency Course",
      organization: "SwiftLee – Antoine van der Lee",
      url: "https://www.avanderlee.com/swift-concurrency-course-swift-6-migration/",
      period: "Sep 2025 – Jan 2026",
      description:
        "Antoine van der Lee's course on modern Swift concurrency (Swift 6): async/await, structured concurrency and actors.",
      tags: ["Swift 6", "Concurrency", "async/await", "Actors"],
    },
    {
      title: "iOS Lead Essentials – Blue Belt",
      organization: "Essential Developer Academy",
      url: "https://www.essentialdeveloper.com/p/ios-lead-essentials/",
      period: "Sep 2023 – Aug 2024",
      description:
        "A hands-on program on building solid iOS apps: SOLID, Clean Architecture, testable code, modularization and Swift Concurrency, with code reviews and mentoring from senior engineers.",
      tags: ["Clean Architecture", "TDD", "SOLID", "Swift"],
    },
  ],
  education: [
    {
      degree: "MSc Computer Engineering",
      institution: "Politecnico di Torino",
      period: "2019 – 2022",
      grade: "110/110 cum laude",
    },
    {
      degree: "BSc Computer and Automation Engineering",
      institution: "Università Politecnica delle Marche",
      period: "2016 – 2019",
      grade: "107/110",
    },
  ],
  projects: [
    {
      title: "Personal site",
      description:
        "This site — Next.js and MDX, bilingual, with articles written in Markdown and pulled from a private GitHub repo.",
      tags: ["Next.js", "TypeScript", "shadcn/ui", "MDX"],
      category: "web",
      featured: true,
      url: "https://marcolagala.com",
    },
    {
      title: "Online store",
      description:
        "Full-stack e-commerce for a clothing store, with Next.js, Stripe payments and a custom CRM for orders and customers.",
      tags: ["Next.js", "TypeScript", "Stripe", "CRM"],
      category: "web",
      featured: false,
      url: "https://www.chiaramonimacerata.it/it",
    },
  ],
} satisfies Content
