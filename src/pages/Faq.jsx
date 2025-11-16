import { AlertTriangle, BookOpen } from "lucide-react";
import PrimaryNav from "../components/PrimaryNav";
import Footer from "./footer";

const faqSections = [
  {
    id: "recharge-process",
    title: "↘️ 1. Recharge process",
    content: [
      "Recharges can be made through cryptocurrency approved payment platforms.",
      "The minimum recharge amount is $50.",
      "All recharges are subject to verification and approval by our customer support.",
      "It is the responsibility of the members to ensure that the payment information provided by customer service is the latest wallet address.",
      "Members should only recharge from accounts held in their name.",
      "Any suspicious or fraudulent recharge will be investigated, and appropriate actions, including reporting to the relevant authorities, will be taken.",
      "Recharges are non-refundable and cannot be reversed.",
      "In the event of any discrepancy or issue with a recharge, Members must contact our customer support for assistance.",
      "We reserve the right to modify, suspend, or terminate the recharge options or terms and conditions at our discretion.",
    ],
  },
  {
    id: "reservation",
    title: "↘️ 2. Reservation",
    content: [
      "After completing your personal information and recharging your account, click “Start Tour Now” to begin a reservation.",
      "Patiently wait for the system to book an order, then submit the order once the submission pop up is displayed.",
      "Complete 36 (Short Tour) submissions per day to perform withdrawal.",
    ],
  },
  {
    id: "withdrawal",
    title: "↘️ 3. Withdrawal",
    content: [
      "Before making a withdrawal, please enter your withdrawal information in the app.",
      "The withdrawal member must have a credit score of 100% and complete the 36 (Short Tour) submission requirements.",
      "During platform working hours, you can withdraw your money through the home page’s “Withdrawal” interface.",
      "Click the “Withdrawal” button after entering the amount you want to withdraw and your withdrawal password.",
      "The specific arrival time is subject to the bank.",
    ],
  },
  {
    id: "agent-mode",
    title: "↘️ 4. Platform agent mode",
    content: [
      "Platform users can become platform agents by recommending new members and receive extra dynamic rewards.",
      "The reward is 22% of the daily commission for direct inferior users.",
    ],
  },
  {
    id: "operational-hours",
    title: "↘️ 5. Operational hours for Withdrawal and Recharge",
    content: [
      "The platform operates from 10:00 to 22:00 daily, and users can accept data during the platform’s operating hours.",
      "Note: For any further clarification, please contact our online customer service.",
    ],
  },
];

export default function Faq() {

  return (
    <div className="min-h-screen bg-momondo-purple text-white">
      <PrimaryNav />
      <div className="px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-pink-300" />
              <span>Frequently Asked Questions</span>
            </div>
            <p className="text-sm text-purple-200">Everything you need to know about staying compliant on our platform.</p>
          </div>

          <section className="bg-white/10 border border-white/15 rounded-3xl p-6 shadow-lg shadow-black/20 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <AlertTriangle className="h-6 w-6 text-yellow-300" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-yellow-100">
                  ⚠️ Warning
                </h2>
                <p className="text-sm leading-relaxed text-purple-100">
                  The account ID will be frozen if the system discovers that the same wallet address is linked to several registered accounts on the
                  platform. Personal multi-account accepting data will lead to the suspension of the merchant&apos;s store, affecting the merchant&apos;s
                  credibility and the invalidation of sales data. The platform prohibits the same crypto wallet bound to multiple accounts. Please DO NOT
                  use individual multi-account; a crypto wallet bound to multiple accounts will lead to funds freeze for up to 180 days or an account
                  permanently blocked for future processing. The platform is designed to prevent malicious money laundering, cashing out, or other improper
                  behavior.
                </p>
              </div>
            </div>
          </section>

          {faqSections.map((section) => (
            <section
              key={section.id}
              className="bg-white/10 border border-white/15 rounded-3xl p-6 shadow-lg shadow-black/15 space-y-4"
            >
              <h3 className="text-white text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-2 text-sm text-purple-100 leading-relaxed">
                {section.content.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

