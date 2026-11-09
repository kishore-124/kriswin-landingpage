import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

/* =========================================================
   Kriswin Infotech — default website content
   Everything here can be edited later from the admin panel.
   ========================================================= */

const SETTINGS = {
  companyName: "Kriswin Infotech Private Limited",
  tagline: "Smart software. Real business results.",
  primaryColor: "#0085B1",
  accentColor: "#5DB823",
  logoUrl: "/brand/kriswin-logo.svg",
  logoLightUrl: "/brand/kriswin-logo-white.svg",
  email: "software@kriswin-infotech.com",
  phone: "+91 7010950016 / +917010889324",
  whatsapp: "",
  address: "India",
  mapEmbedUrl: "",
  linkedin: "https://www.linkedin.com",
  facebook: "https://www.facebook.com",
  instagram: "https://www.instagram.com",
  twitter: "https://x.com",
  youtube: "",
  heroBadge: "Software development & IT services company",
  heroTitle: "We turn bold ideas into software that scales",
  heroSubtitle:
    "Kriswin Infotech designs, builds and supports web apps, mobile apps, AI-powered automation and cloud platforms — and creates SaaS products used by real customers every day.",
  heroCtaText: "Book a free 30-min call",
  heroCta2Text: "See our work",
  statYears: "8+",
  statClients: "150+",
  statProjects: "300+",
  statSupport: "99.9%",
  aboutTitle: "Engineering partners for ambitious businesses",
  aboutContent:
    "Kriswin Infotech Private Limited is a software development and IT services company. We partner with startups, SMEs and enterprises to plan, design, build and scale digital products — from the first prototype to millions of users.\n\nWe also build and run our own products, like EasyBillo, so we know first-hand what it takes to launch software, win customers and keep it running reliably every day.",
  mission:
    "To help every business use technology with confidence — through honest advice, quality engineering and long-term support.",
  vision:
    "To be the most trusted technology partner for growing businesses in India and around the world.",
  values:
    "Client success first | Your outcomes are how we measure our own success.\nQuality without compromise | Clean code, thoughtful design and thorough testing.\nRadical transparency | Clear estimates, weekly demos and open communication.\nOwnership | We treat your product as if it were our own.",
  whyUs:
    "bi-lightning-charge | Faster time to market | Agile sprints and weekly demos so you see real progress every week.\nbi-shield-lock | Secure by default | Security best practices and code reviews built into every project.\nbi-person-badge | Dedicated team | A named project manager and engineers who understand your business.\nbi-graph-up-arrow | Built to scale | Cloud-native architecture that grows with your users.\nbi-headset | Support after launch | Monitoring, maintenance and enhancements long after go-live.\nbi-cash-coin | Flexible engagement | Fixed price, time & material or dedicated team — your choice.",
  ctaTitle: "Let's build something great together",
  ctaSubtitle: "Tell us about your idea. Get a free consultation and a clear estimate within 48 hours.",
  footerAbout:
    "Kriswin Infotech Private Limited builds custom software, mobile apps, AI solutions and SaaS products that help businesses grow.",
  metaDescription:
    "Kriswin Infotech Private Limited — custom software development, web & mobile apps, AI automation, cloud & DevOps and SaaS products.",
  trustedBy: "EasyBillo\nRetail Hub\nMediCare+\nEduSphere\nFleetLine\nFinEdge\nAgroNext",
  challenges:
    "bi-hourglass-split | Projects that never ship | Missed deadlines and endless delays that cost you market opportunities.\nbi-puzzle | Systems that don't talk | Disconnected tools and manual work slowing your team down.\nbi-bug | Poor quality & bugs | Unstable software that frustrates users and damages your brand.\nbi-cash-stack | Rising IT costs | Cloud bills and maintenance costs growing faster than your revenue.\nbi-people | Hard-to-find talent | Struggling to hire and retain skilled developers.\nbi-question-circle | No clear roadmap | Unsure which technology or approach is right for your business.",
  technologies:
    "Frontend | React, Next.js, Angular, Vue.js, TypeScript, Bootstrap\nBackend | Node.js, .NET, Java, Python, PHP, Laravel\nMobile | Flutter, React Native, Android (Kotlin), iOS (Swift)\nCloud & DevOps | AWS, Azure, Google Cloud, Docker, Kubernetes, CI/CD\nDatabase | PostgreSQL, MySQL, MongoDB, Redis, SQL Server\nAI & Data | OpenAI, Claude, LangChain, Python ML, Power BI",
  industries:
    "bi-cart3 | Retail & E-commerce\nbi-heart-pulse | Healthcare\nbi-mortarboard | Education\nbi-truck | Logistics\nbi-bank | Finance & Fintech\nbi-buildings | Real Estate\nbi-airplane | Travel & Hospitality\nbi-gear-wide-connected | Manufacturing",
  faqs:
    "How much does a project cost? | It depends on scope and complexity. After a free consultation we share a clear, itemised estimate — fixed price or time & material.\nHow long does it take to build an app? | A typical MVP takes 8–12 weeks. Larger platforms are delivered in phases so you can launch early and improve continuously.\nWill I own the source code? | Yes. You get full ownership of the source code and IP once the project is complete.\nDo you sign an NDA? | Absolutely. We are happy to sign an NDA before you share any project details.\nDo you provide support after launch? | Yes — we offer maintenance plans covering bug fixes, monitoring, updates and new features.",
  consultPoints:
    "A free 30-minute call with a senior consultant\nHonest advice on technology and approach\nA clear estimate of time and cost within 48 hours\nNDA signed on request — your idea stays safe",
};

const SERVICES = [
  ["Web Application Development", "web-development", "bi-window-stack", "Fast, secure and scalable web apps, portals and SaaS platforms built with modern frameworks.", "React / Next.js development\nCustom portals & dashboards\nE-commerce & payment integration\nSEO & performance optimisation\nProgressive Web Apps"],
  ["Mobile App Development", "mobile-app-development", "bi-phone", "Native and cross-platform Android & iOS apps with smooth, delightful experiences.", "Flutter & React Native\nNative Android & iOS\nOffline mode & push notifications\nApp Store / Play Store launch\nAnalytics & crash monitoring"],
  ["AI & Automation", "ai-automation", "bi-stars", "Put AI to work — chatbots, document processing, smart workflows and generative AI features.", "AI chatbots & assistants\nGenerative AI integration\nWorkflow & process automation\nDocument / data extraction\nPredictive analytics"],
  ["Custom Software Development", "custom-software-development", "bi-code-slash", "Tailor-made software built around your business processes — ERP, CRM and more.", "Requirement analysis & architecture\nERP, CRM & billing systems\nAPI development & integrations\nLegacy modernisation\nDocumentation & handover"],
  ["Cloud & DevOps", "cloud-devops", "bi-cloud-check", "Cloud migration, CI/CD and infrastructure that's reliable, secure and cost-efficient.", "AWS, Azure & GCP\nCI/CD pipelines\nDocker & Kubernetes\n24/7 monitoring & alerting\nCloud cost optimisation"],
  ["UI/UX Design", "ui-ux-design", "bi-palette", "Research-driven product design that makes complex things feel simple and intuitive.", "User research & journeys\nWireframes & prototypes\nDesign systems\nUsability testing\nBranding & visual identity"],
  ["QA & Testing", "qa-testing", "bi-bug", "Manual and automated testing that keeps your releases stable and your users happy.", "Manual & exploratory testing\nTest automation\nPerformance & load testing\nSecurity testing\nRegression suites"],
  ["IT Consulting & Support", "it-consulting-support", "bi-headset", "Technology roadmaps, code audits, dedicated developers and ongoing maintenance.", "Technology consulting\nCode & security audits\nDedicated developers\nAnnual maintenance (AMC)\nHelpdesk & support"],
] as const;

const PRODUCTS = [
  {
    name: "EasyBillo",
    slug: "easybillo",
    tagline: "Book trusted local pros for home, vehicle and daily needs",
    description:
      "EasyBillo is a local services marketplace that connects households with verified professionals — electricians, plumbers, drivers, cooks and more. Customers compare pros by price, reviews and experience, pay after the work is done, and stay safe with built-in SOS.",
    features:
      "Verified local professionals\nCompare by price, reviews & experience\nPay by cash or UPI after the work\nQuotes for bigger projects with milestone payments\nSOS safety alerts for family\nWeekly payouts for service pros",
    icon: "bi-tools",
    websiteUrl: "https://easybillo.in",
    priceLabel: "Free to join",
    badge: "Flagship",
  },
  {
    name: "Product Two",
    slug: "product-two",
    tagline: "Sample product — edit or replace me in Admin → Products",
    description: "Placeholder content. Update the name, description, features, link and pricing from the admin panel.",
    features: "Feature one\nFeature two\nFeature three\nFeature four",
    icon: "bi-receipt",
    priceLabel: "From ₹499/month",
    badge: "New",
  },
  {
    name: "Product Three",
    slug: "product-three",
    tagline: "Sample product — edit or replace me in Admin → Products",
    description: "Placeholder content. Update the name, description, features, link and pricing from the admin panel.",
    features: "Feature one\nFeature two\nFeature three\nFeature four",
    icon: "bi-bar-chart-line",
    priceLabel: "Contact for pricing",
    badge: "",
  },
];

const CASE_STUDIES = [
  {
    title: "Building a local services marketplace from zero to launch",
    slug: "easybillo-local-services-marketplace",
    client: "EasyBillo",
    industry: "Marketplace",
    summary: "How we designed and built a two-sided marketplace connecting households with verified local professionals.",
    challenge: "Customers struggled to find trustworthy local professionals, and skilled workers lacked a steady source of jobs and reliable payouts.",
    solution: "We built customer and partner apps with verified profiles, transparent pricing, start-code verification, milestone payments for larger jobs and an SOS safety feature.",
    results: "Launched in under 4 months\nCovering 70+ districts\nPay-after-work model builds trust\nWeekly payouts for service partners",
    techStack: "Next.js, Flutter, Node.js, PostgreSQL, AWS",
    readTime: "6 min",
  },
  {
    title: "Digitising billing and inventory for a retail chain",
    slug: "retail-billing-inventory",
    client: "Sample retail client",
    industry: "Retail",
    summary: "Sample case study — replace with your own project in Admin → Case Studies.",
    challenge: "Manual billing and stock tracking across multiple stores caused errors and stock-outs.",
    solution: "A cloud POS with real-time inventory sync, GST invoicing and a management dashboard.",
    results: "60% faster checkout\nReal-time stock across stores\nZero manual reconciliation",
    techStack: "React, .NET, SQL Server, Azure",
    readTime: "5 min",
  },
  {
    title: "An AI assistant that answers patient queries 24/7",
    slug: "healthcare-ai-assistant",
    client: "Sample healthcare client",
    industry: "Healthcare",
    summary: "Sample case study — replace with your own project in Admin → Case Studies.",
    challenge: "Front-desk staff spent hours every day answering the same appointment and billing questions.",
    solution: "An AI chatbot on web and WhatsApp integrated with the clinic's appointment system.",
    results: "70% of queries handled automatically\nAppointments booked 24/7\nHappier front-desk staff",
    techStack: "Python, LLM APIs, Node.js, WhatsApp API",
    readTime: "4 min",
  },
];

async function main() {
  // ---------- Admin user ----------
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, name: "Administrator", passwordHash: await bcrypt.hash(password, 10) },
  });

  // ---------- Settings ----------
  // Fresh database, or still using the old placeholder company → load the Kriswin content.
  const existing = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const fresh = !existing || existing.companyName === "NexaByte Technologies";

  if (fresh) {
    await prisma.siteSetting.upsert({ where: { id: 1 }, update: SETTINGS, create: { id: 1, ...SETTINGS } });
    // Replace the old placeholder sample content
    await prisma.$transaction([
      prisma.service.deleteMany(),
      prisma.product.deleteMany(),
      prisma.teamMember.deleteMany(),
      prisma.testimonial.deleteMany(),
      prisma.caseStudy.deleteMany(),
    ]);
  } else {
    // Only fill sections that are still empty — never overwrite your edits
    const fill: Record<string, string> = {};
    for (const [k, v] of Object.entries(SETTINGS)) {
      if ((existing as unknown as Record<string, unknown>)[k] === "") fill[k] = v;
    }
    if (Object.keys(fill).length) await prisma.siteSetting.update({ where: { id: 1 }, data: fill });
  }

  // ---------- Services ----------
  if ((await prisma.service.count()) === 0) {
    for (const [i, [title, slug, icon, summary, features]] of SERVICES.entries()) {
      await prisma.service.create({
        data: { title, slug, icon, summary, description: summary, features, sortOrder: i },
      });
    }
  }

  // ---------- Products ----------
  if ((await prisma.product.count()) === 0) {
    for (const [i, p] of PRODUCTS.entries()) await prisma.product.create({ data: { ...p, sortOrder: i } });
  }

  // ---------- Case studies ----------
  if ((await prisma.caseStudy.count()) === 0) {
    for (const [i, c] of CASE_STUDIES.entries()) await prisma.caseStudy.create({ data: { ...c, sortOrder: i } });
  }

  // ---------- Team & testimonials (samples) ----------
  if ((await prisma.teamMember.count()) === 0) {
    await prisma.teamMember.createMany({
      data: [
        { name: "Founder Name", role: "Founder & CEO", bio: "Sample profile — edit in Admin → Team.", sortOrder: 0 },
        { name: "Tech Lead", role: "Head of Engineering", bio: "Sample profile — edit in Admin → Team.", sortOrder: 1 },
        { name: "Design Lead", role: "UI/UX Lead", bio: "Sample profile — edit in Admin → Team.", sortOrder: 2 },
        { name: "Client Success", role: "Project Manager", bio: "Sample profile — edit in Admin → Team.", sortOrder: 3 },
      ],
    });
  }
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: [
        { name: "Client Name", company: "Retail business owner", quote: "Kriswin understood our business quickly and delivered a system our staff actually enjoys using. Their support after launch has been excellent.", rating: 5, sortOrder: 0 },
        { name: "Client Name", company: "Healthcare startup founder", quote: "Clear communication, weekly demos and an app that went live ahead of schedule. Exactly what we needed.", rating: 5, sortOrder: 1 },
        { name: "Client Name", company: "Logistics company CTO", quote: "They migrated us to the cloud with zero downtime and cut our hosting costs significantly. Highly recommended.", rating: 5, sortOrder: 2 },
      ],
    });
  }

  console.log(`Seed complete. Admin login: ${email} / ${process.env.ADMIN_PASSWORD ? "(from ADMIN_PASSWORD)" : password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
