import type { Content } from "../types"

export default {
  profile: {
    role: "Mobile Engineer",
    location: "Torino, Italia",
    bio: "Sono un Mobile Engineer a Torino e lavoro nel team Platform di TheFork. Sviluppo app iOS con Swift e SwiftUI e ho un debole per il Clean Code e per le interfacce curate nei minimi dettagli. Ogni tanto mi dedico anche allo sviluppo web, giusto per cambiare aria.",
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
      title: "Mobile Engineer II, iOS – Team Platform",
      organization: "TheFork (gruppo Tripadvisor)",
      period: "Apr 2026 – oggi",
      description:
        "Nel team Platform lavoro sulle fondamenta dell'app iOS di TheFork: architettura della navigazione, ciclo di vita dell'app e modularizzazione del codice. Seguo gli aggiornamenti alle nuove versioni di iOS e Xcode e mantengo gli strumenti che supportano il lavoro quotidiano del team, come SwiftLint, SwiftFormat e le pipeline su GitHub Actions.",
      tags: ["Swift", "SwiftUI", "Xcode", "GitHub Actions"],
    },
    {
      title: "Consultant Mid iOS Engineer – Insurance Platforms",
      organization: "Iriscube Reply",
      period: "Apr 2023 – Mar 2026",
      description:
        "Punto di riferimento iOS per l'app Intesa Sanpaolo Assicurazioni: ho collaborato con gli stakeholder di business nella definizione dei requisiti e ho seguito le funzionalità dalla progettazione al rilascio in produzione, gestendo anche la pipeline CI/CD. Ho affiancato gli sviluppatori junior come mentor.",
      tags: ["Swift", "UIKit", "SwiftUI", "Intesa Sanpaolo"],
    },
    {
      title: "Consultant – iOS Customer Service",
      organization: "Iriscube Reply",
      period: "Giu 2022 – Nov 2023",
      description:
        "Ho contribuito all'architettura e allo sviluppo dell'area Customer Service della nuova app isybank, integrando SDK di chatbot e di condivisione dello schermo per l'assistenza in-app, e ne ho seguito l'evoluzione anche nell'app Intesa Sanpaolo.",
      tags: ["Swift", "UIKit", "isybank", "Intesa Sanpaolo"],
    },
    {
      title: "Tirocinio di tesi",
      organization: "Enhancers S.p.A.",
      period: "Mar 2022 – Mag 2022",
      description:
        "Nell'ambito della tesi magistrale ho sviluppato funzionalità per un forno connesso e per l'app smart home hOn, in React Native e TypeScript, per migliorare l'interazione quotidiana con il forno.",
      tags: ["React Native", "TypeScript", "IoT"],
    },
    {
      title: "IT Consultant",
      organization: "JEToP – Junior Enterprise",
      organizationUrl: "https://www.linkedin.com/company/j-e-to-p-/",
      period: "Feb 2022 – Giu 2022",
      description:
        "Consulenza part-time in JEToP, la Junior Enterprise del Politecnico di Torino: ho gestito progetti software per clienti esterni in parallelo agli studi.",
      tags: [],
    },
    {
      title: "IT Assistant",
      organization: "JEToP – Junior Enterprise",
      organizationUrl: "https://www.linkedin.com/company/j-e-to-p-/",
      period: "Nov 2021 – Feb 2022",
      description:
        "Il mio primo ruolo in JEToP, la Junior Enterprise del Politecnico di Torino: ho supportato i team di progetto e curato la manutenzione degli strumenti digitali interni.",
      tags: [],
    },
  ],
  apps: [
    {
      name: "TheFork",
      context: "Gruppo Tripadvisor · Team Platform",
      icon: "/apps/thefork.png",
      url: "https://apps.apple.com/it/app/thefork-ristoranti-e-offerte/id424850908",
    },
    {
      name: "Intesa Sanpaolo Assicurazioni",
      context: "Iriscube Reply · Piattaforme assicurative",
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
      period: "Set 2025 – Gen 2026",
      description:
        "Il corso di Antoine van der Lee sulla concorrenza in Swift 6: async/await, structured concurrency e actor.",
      tags: ["Swift 6", "Concurrency", "async/await", "Actors"],
    },
    {
      title: "iOS Lead Essentials – Blue Belt",
      organization: "Essential Developer Academy",
      url: "https://www.essentialdeveloper.com/p/ios-lead-essentials/",
      period: "Set 2023 – Ago 2024",
      description:
        "Un programma pratico per progettare app iOS solide: SOLID, Clean Architecture, codice testabile, modularizzazione e Swift Concurrency, con code review e mentoring di ingegneri senior.",
      tags: ["Clean Architecture", "TDD", "SOLID", "Swift"],
    },
  ],
  education: [
    {
      degree: "Laurea Magistrale in Ingegneria Informatica",
      institution: "Politecnico di Torino",
      period: "2019 – 2022",
      grade: "110/110 con lode",
    },
    {
      degree: "Laurea Triennale in Ingegneria Informatica e dell'Automazione",
      institution: "Università Politecnica delle Marche",
      period: "2016 – 2019",
      grade: "107/110",
    },
  ],
  projects: [
    {
      title: "Sito personale",
      description:
        "Questo sito: Next.js e MDX, in italiano e in inglese, con gli articoli scritti in Markdown e letti da una repo GitHub privata.",
      tags: ["Next.js", "TypeScript", "shadcn/ui", "MDX"],
      category: "web",
      featured: true,
      url: "https://marcolagala.com",
    },
    {
      title: "Negozio online",
      description:
        "E-commerce full-stack per un negozio di abbigliamento, con Next.js, pagamenti Stripe e un CRM su misura per gestire ordini e clienti.",
      tags: ["Next.js", "TypeScript", "Stripe", "CRM"],
      category: "web",
      featured: false,
      url: "https://www.chiaramonimacerata.it/it",
    },
  ],
} satisfies Content
