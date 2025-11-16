import { Users, Sparkles, Globe2, Target } from "lucide-react";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";

const introParagraphs = [
  "We are a team of friendly travel professionals who have an engaging approach to work. Through our network, we instigate introductions and create opportunities for destinations and products that open doors and deliver results. We treat our clients as individuals and seek to understand and enhance their unique positioning within the marketplace creating a strategic and cost-effective solution for growth. We take pride in having a consistent team of experts. Always listening, learning and evolving.",
  "We are bespoke full-service providers that are contemporary with experience, creative with an edge, professional with an accent on fun and connected to deliver results.",
];

const storyParagraphs = [
  "TTM is a fully-serviced representation agency, specialising in the travel and tourism industry and providing representation in the UK and Ireland. You’ll find a close, friendly team who have all grown and are growing within the industry, and between them there’s over 200 years of experience. Their clients are a range of destinations, tourist attractions and airlines. TTM is a professional, proactive and creative team who take pride in their work to ensure they provide tailored initiatives that maximise return on investment.",
  "The committed team provides high quality, personable services using their in-house skills and knowledge as well as their extensive contacts both in travel and media, to deliver results in line with a client’s goals and objectives. Services range from the very best in sales, PR, media, marketing and more within travel trade and consumer markets. If you’re looking for long or short term targets TTM can deliver as they listen, strategically plan, are creative, understand the audience and deliver prompt results in a decisive and professional manner.",
];

const clients = [
  "Discover New England",
  "Louisiana Office of Tourism",
  "Massachusetts Office of Travel & Tourism",
  "Maverick Aviation Group: Las Vegas, Grand Canyon & Hawaii",
  "MC Turismo: Brazil",
  "New Orleans & Company",
  "Tennessee Department of Tourist Development",
  "Travel Texas",
  "Visit North Carolina",
];

const projects = [
  "Experience Scottsdale",
  "Greater Boston CVB",
  "Louisiana Northshore, St Tammany Parish",
  "Rhode Island Commerce Corporation",
  "Rhythms of the South",
  "Travel South USA",
  "Tucson CVB",
  "Visit Baton Rouge",
  "Visit Mesa",
  "West Virginia Tourism",
];

const highlightCards = [
  {
    icon: Users,
    title: "Our Team",
    description:
      "A passionate collective of friendly travel professionals who enjoy what they do, collaborate deeply and celebrate every win.",
  },
  {
    icon: Sparkles,
    title: "Our Approach",
    description:
      "Bespoke, strategic and cost-effective. We align with your brand identity to enhance visibility and deliver measurable growth.",
  },
  {
    icon: Globe2,
    title: "Our Reach",
    description:
      "Connected across destinations, attractions and airlines, opening doors and creating opportunities throughout global markets.",
  },
  {
    icon: Target,
    title: "Our Promise",
    description:
      "Always listening, learning and evolving to provide high-quality, creative initiatives tailored to your goals.",
  },
];

function HighlightCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white/10 border border-white/15 rounded-3xl p-6 shadow-lg shadow-black/20 space-y-3">
      <div className="h-12 w-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-200">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-purple-100 leading-relaxed">{description}</p>
    </div>
  );
}

function TextBlock({ heading, paragraphs }) {
  return (
    <section className="bg-white/10 border border-white/15 rounded-3xl p-6 md:p-8 shadow-lg shadow-black/20 space-y-4">
      <h2 className="text-xl font-semibold text-white">{heading}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-sm md:text-base leading-relaxed text-purple-100">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

function ListBlock({ heading, items }) {
  return (
    <section className="bg-white/10 border border-white/15 rounded-3xl p-6 md:p-8 shadow-lg shadow-black/20 space-y-4">
      <h3 className="text-lg font-semibold text-white">{heading}</h3>
      <ul className="grid gap-3 text-sm md:text-base text-purple-100">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-momondo-purple text-white">
      <PrimaryNav />
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-white">About Us</h1>
            <p className="text-sm text-purple-100">
              A passionate team who enjoy what they do and work together to deliver results.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlightCards.map((card) => (
              <HighlightCard key={card.title} icon={card.icon} title={card.title} description={card.description} />
            ))}
          </div>

          <TextBlock heading="Who We Are" paragraphs={introParagraphs} />

          <TextBlock heading="Our Story" paragraphs={storyParagraphs} />

          <div className="grid gap-6 md:grid-cols-2">
            <ListBlock heading="Clients" items={clients} />
            <ListBlock heading="Project Work" items={projects} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

