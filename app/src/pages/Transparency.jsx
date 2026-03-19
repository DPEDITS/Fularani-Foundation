import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, ShieldCheck, ChevronDown } from "lucide-react";

// The document data structure based on the provided project folders
const documentSubtopics = [
  {
    title: "Blood Credit System",
    documents: [
      { id: 1, name: "System Operations Manual", link: "#" },
      { id: 2, name: "Impact Report & Logs", link: "#" },
    ]
  },
  {
    title: "Blood Equipment",
    documents: [
      { id: 1, name: "Equipment Purchase Invoices", link: "#" },
      { id: 2, name: "Maintenance & Quality Check", link: "#" },
    ]
  },
  {
    title: "Education",
    documents: [
      { id: 1, name: "Scholarship Distribution Record", link: "#" },
      { id: 2, name: "Program Expense Breakdown", link: "#" },
    ]
  },
  {
    title: "Gachha chhai",
    documents: [
      { id: 1, name: "Plantation Drive Impact", link: "#" },
      { id: 2, name: "Seedling Invoices", link: "#" },
    ]
  },
  {
    title: "Gym",
    documents: [
      { id: 1, name: "Public Gym Equipment Budget", link: "#" },
    ]
  },
  {
    title: "Lighthouse",
    documents: [
      { id: 1, name: "Project Completion Report", link: "#" },
      { id: 2, name: "Financial Audit", link: "#" },
    ]
  },
  {
    title: "Mobility",
    documents: [
      { id: 1, name: "Wheelchair Handover Register", link: "#" },
      { id: 2, name: "Vendor Invoices", link: "#" },
    ]
  },
  {
    title: "Nursio Innovation",
    documents: [
      { id: 1, name: "Innovation Grant Allocation", link: "#" },
    ]
  },
  {
    title: "Period Pride",
    documents: [
      { id: 1, name: "Campaign Expenditure", link: "#" },
      { id: 2, name: "Awareness Session Logs", link: "#" },
    ]
  },
  {
    title: "Sahara",
    documents: [
      { id: 1, name: "Relief Distribution Accounts", link: "#" },
    ]
  },
  {
    title: "Soch Udyam",
    documents: [
      { id: 1, name: "Startup Grant Register", link: "#" },
      { id: 2, name: "Mentorship Costs & Receipts", link: "#" },
    ]
  },
  {
    title: "Swachha Bhadrak",
    documents: [
      { id: 1, name: "Cleanliness Drive Expenses", link: "#" },
      { id: 2, name: "Volunteer Equipment Bills", link: "#" },
    ]
  },
  {
    title: "Thalassemia",
    documents: [
      { id: 1, name: "Patient Support Ledger", link: "#" },
      { id: 2, name: "Camp Organization Costs", link: "#" },
    ]
  },
  {
    title: "Wall",
    documents: [
      { id: 1, name: "Construction Estimates", link: "#" },
      { id: 2, name: "Material & Labor Invoices", link: "#" },
    ]
  }
];

const SubtopicSection = ({ subtopic, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-sm"
    >
      <div 
        className="p-5 md:p-6 flex justify-between items-center cursor-pointer hover:bg-white/[0.04] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-4">
          <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold shrink-0 border border-primary/20">
            {index + 1}
          </span>
          <span className="capitalize">{subtopic.title}</span>
        </h2>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ duration: 0.3 }}
          className="text-gray-400 p-2 bg-white/5 rounded-full"
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 border-t border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest font-bold bg-white/[0.01]">
                      <th className="py-4 px-4 w-2/3 rounded-tl-lg">Document Name</th>
                      <th className="py-4 px-4 text-right rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subtopic.documents.map((doc, docIdx) => (
                      <tr 
                        key={doc.id} 
                        className={`transition-colors group hover:bg-white/[0.03] ${
                          docIdx !== subtopic.documents.length - 1 ? "border-b border-white/5" : ""
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3 text-gray-300 font-medium">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary/70 group-hover:bg-primary group-hover:text-white transition-all">
                                <FileText size={18} />
                            </div>
                            {doc.name}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <a
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-primary text-white text-sm font-semibold rounded-lg transition-all border border-white/10 hover:border-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download size={16} />
                            <span>Download</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Transparency = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-24 pb-16 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
            <ShieldCheck size={18} />
            <span>100% Accountability</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Our Public <span className="text-primary">Records</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Every impact is backed by transparency. Browse through our project subtopics below to view and download relevant financial records, receipts, and audit reports.
          </p>
        </motion.div>

        <div className="space-y-4">
          {documentSubtopics.map((subtopic, index) => (
            <SubtopicSection key={subtopic.title} subtopic={subtopic} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transparency;
