import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Shield, Mail, Phone, Globe, ChevronRight } from "lucide-react";

const PrivacyPolicy = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <div className="bg-[#fbfbfd] min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-white/50 text-sm font-bold mb-8"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Privacy Policy</span>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Shield size={28} className="text-primary" />
              </div>
              <div className="inline-block bg-primary/20 px-4 py-1.5 rounded-full">
                <span className="text-primary text-xs font-black uppercase tracking-widest">Legal</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-6">
              Privacy Policy
            </h1>
            <p className="text-white/50 text-lg md:text-xl font-medium max-w-2xl">
              Your privacy matters to us. This policy outlines how we collect, use, and protect your information.
            </p>
            <p className="text-white/30 text-sm font-bold mt-6">
              Last Updated: March 18, 2026
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-16"
        >
          {/* Introduction */}
          <Section>
            <p className="text-gray-600 text-lg leading-relaxed">
              This Privacy Policy describes our policies and procedures regarding the collection, use, and disclosure of your information when you use the Service. It also informs you about your privacy rights and how the law protects you.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We use your personal data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </Section>

          {/* Interpretation */}
          <Section title="Interpretation">
            <p>
              The words of which the initial letter is capitalized have meanings defined under the following conditions. These definitions shall have the same meaning regardless of whether they appear in the singular or the plural.
            </p>
          </Section>

          {/* Definitions */}
          <Section title="Definitions">
            <p className="mb-6">For the purposes of this Privacy Policy:</p>
            <div className="space-y-4">
              <DefinitionItem term="Account" definition='means a unique account created for you to access our Service or parts of our Service.' />
              <DefinitionItem term="Company" definition='(referred to as either "the Company," "we," "us," or "our" in this Agreement) refers to Fularani Foundation, Bhubaneswar, Odisha, India.' />
              <DefinitionItem term="Cookies" definition='are small files placed on your computer, mobile device, or any other device by a website, containing the details of your browsing history on that website among its many uses.' />
              <DefinitionItem term="Country" definition='refers to Odisha, India.' />
              <DefinitionItem term="Device" definition='means any device that can access the Service, such as a computer, a cellphone, or a digital tablet.' />
              <DefinitionItem term="Personal Data" definition='is any information that relates to an identified or identifiable individual.' />
              <DefinitionItem term="Service" definition='refers to the Website.' />
              <DefinitionItem term="Service Provider" definition='means any natural or legal person who processes data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, provide the Service on behalf of the Company, perform services related to the Service, or assist the Company in analyzing how the Service is used.' />
              <DefinitionItem term="Third-party Social Media Service" definition='refers to any website or social network website through which a user can log in or create an account to use the Service.' />
              <DefinitionItem term="Usage Data" definition='refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).' />
              <DefinitionItem term="Website" definition='refers to Fularani Foundation, accessible from https://www.fularanifoundation.org.' />
              <DefinitionItem term="You" definition='means the individual accessing or using the Service or the company or other legal entity on behalf of which such an individual is accessing or using the Service, as applicable.' />
            </div>
          </Section>

          {/* Collecting and Using Your Personal Data */}
          <Section title="Collecting and Using Your Personal Data">
            <SubSection title="Types of Data Collected" />

            <SubSection title="Personal Data">
              <p className="mb-4">
                While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to:
              </p>
              <BulletList items={[
                "Email address",
                "First name and last name",
                "Phone number",
                "Address, State, Province, ZIP/Postal code, City",
                "Usage Data",
              ]} />
            </SubSection>

            <SubSection title="Usage Data">
              <p>
                Usage Data is collected automatically when using the Service.
              </p>
              <p>
                Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
              </p>
              <p>
                When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
              </p>
              <p>
                We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
              </p>
            </SubSection>
          </Section>

          {/* Tracking Technologies and Cookies */}
          <Section title="Tracking Technologies and Cookies">
            <p>
              We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.
            </p>
            <p>
              You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service.
            </p>
            <p className="mb-6">
              Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser. We use both session and persistent Cookies for the purposes set out below:
            </p>

            <div className="space-y-6">
              <CookieCard
                title="Necessary / Essential Cookies"
                type="Session Cookies"
                admin="Us"
                purpose="These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services."
              />
              <CookieCard
                title="Cookies Policy / Notice Acceptance Cookies"
                type="Persistent Cookies"
                admin="Us"
                purpose="These Cookies identify if users have accepted the use of cookies on the Website."
              />
              <CookieCard
                title="Functionality Cookies"
                type="Persistent Cookies"
                admin="Us"
                purpose="These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website."
              />
            </div>
          </Section>

          {/* Use of Your Personal Data */}
          <Section title="Use of Your Personal Data">
            <p className="mb-4">The Company may use Personal Data for the following purposes:</p>
            <BulletList items={[
              "To provide and maintain our service, including monitoring the usage of our service.",
              "To manage your account: to manage your registration as a user of the service. The personal data you provide can grant you access to different functionalities of the service that are available to you as a registered user.",
              "For the performance of a contract: the development, compliance, and execution of the purchase contract for the products, items, or services you have purchased or any other contract with us through the service.",
              "To contact you: to contact you by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products, or contracted services, including security updates when necessary or reasonable for their implementation.",
              "To provide you with news, special offers, and general information about other goods, services, and events that we offer, which are similar to those you have already purchased or inquired about unless you have opted not to receive such information.",
              "To manage your requests: to attend to and manage your requests to us.",
            ]} />

            <p className="mt-8 mb-4 font-bold text-gray-800">We may share your personal information in the following situations:</p>
            <BulletList items={[
              "With Service Providers: We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You.",
              "For Business transfers: We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of our business to another company.",
              "With Affiliates: We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy.",
              "With Business partners: We may share Your information with Our business partners to offer You certain products, services or promotions.",
              "With other users: when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.",
            ]} />
          </Section>

          {/* Retention */}
          <Section title="Retention of Your Personal Data">
            <p>
              The Company will retain your Personal Data only for as long as it is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
            <p>
              The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to enhance the security or improve the functionality of our service, or when we are legally obligated to retain this data for longer periods.
            </p>
          </Section>

          {/* Transfer */}
          <Section title="Transfer of Your Personal Data">
            <p>
              Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. This means that this information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ from those of your jurisdiction.
            </p>
            <p>
              Your consent to this Privacy Policy, followed by your submission of such information, represents your agreement to that transfer.
            </p>
            <p>
              The Company will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy. No transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place, including the security of your data and other personal information.
            </p>
          </Section>

          {/* Disclosure */}
          <Section title="Disclosure of Your Personal Data">
            <SubSection title="Business Transactions">
              <p>
                In the event that the Company is involved in a merger, acquisition, or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.
              </p>
            </SubSection>

            <SubSection title="Law Enforcement">
              <p>
                Under certain circumstances, the Company may be required to disclose your Personal Data if mandated by law or in response to valid requests from public authorities (e.g., a court or a government agency).
              </p>
            </SubSection>

            <SubSection title="Other Legal Requirements">
              <p className="mb-4">The Company may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
              <BulletList items={[
                "Comply with a legal obligation.",
                "Protect and defend the rights or property of the Company.",
                "Prevent or investigate possible wrongdoing in connection with the Service.",
                "Protect the personal safety of users of the Service or the public.",
                "Protect against legal liability.",
              ]} />
            </SubSection>
          </Section>

          {/* Security */}
          <Section title="Security of Your Personal Data">
            <p>
              The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
            </p>
          </Section>

          {/* Links */}
          <Section title="Links to Other Websites">
            <p>
              Our service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
            </p>
            <p>
              We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </Section>

          {/* Changes */}
          <Section title="Changes to this Privacy Policy">
            <p>
              We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
            </p>
            <p>
              We will let you know via email and/or a prominent notice on our Service before the change becomes effective and update the "Last updated" date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </Section>

          {/* Contact */}
          <Section title="Contact Us">
            <p className="mb-6">
              If you have any questions about this Privacy Policy, you can contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ContactCard
                icon={<Mail size={22} className="text-primary" />}
                label="Email us"
                value="connect@fularanifoundation.org"
                href="mailto:connect@fularanifoundation.org"
              />
              <ContactCard
                icon={<Globe size={22} className="text-primary" />}
                label="Visit"
                value="fularanifoundation.org"
                href="https://www.fularanifoundation.org"
              />
              <ContactCard
                icon={<Phone size={22} className="text-primary" />}
                label="Call us"
                value="+91 94396 65220"
                href="tel:+919439665220"
              />
            </div>
          </Section>
        </motion.div>
      </div>
    </div>
  );
};

/* ── Reusable Sub-components ─────────────────────────────────── */

const Section = ({ title, children }) => (
  <section>
    {title && (
      <h2 className="text-2xl md:text-3xl font-black text-secondary tracking-tight mb-6 pb-4 border-b-2 border-primary/10">
        {title}
      </h2>
    )}
    <div className="space-y-4 text-gray-600 leading-relaxed text-[15px] md:text-base">
      {children}
    </div>
  </section>
);

const SubSection = ({ title, children }) => (
  <div className="mt-8 first:mt-0">
    <h3 className="text-lg md:text-xl font-black text-secondary/80 tracking-tight mb-4">
      {title}
    </h3>
    {children && (
      <div className="space-y-3 text-gray-600 leading-relaxed">
        {children}
      </div>
    )}
  </div>
);

const DefinitionItem = ({ term, definition }) => (
  <div className="flex gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <span className="font-black text-primary text-sm whitespace-nowrap shrink-0">"{term}"</span>
    <span className="text-gray-600 text-sm">{definition}</span>
  </div>
);

const BulletList = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item, idx) => (
      <li key={idx} className="flex items-start gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const CookieCard = ({ title, type, admin, purpose }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <h4 className="text-base font-black text-secondary mb-3">{title}</h4>
    <div className="flex flex-wrap gap-3 mb-3">
      <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">Type: {type}</span>
      <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Administered by: {admin}</span>
    </div>
    <p className="text-sm text-gray-500 leading-relaxed">
      <span className="font-bold text-gray-700">Purpose: </span>{purpose}
    </p>
  </div>
);

const ContactCard = ({ icon, label, value, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center group"
  >
    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-secondary">{value}</p>
    </div>
  </a>
);

export default PrivacyPolicy;
