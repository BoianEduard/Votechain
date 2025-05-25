
import React, { useState } from "react";
import { HelpCircle, MessageCircle, Settings, ChevronDown, ChevronUp, Shield, CheckCircle } from "lucide-react";

const DashboardSidebar = () => {
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const faqItems = [
        {
            question: "How do I cast my vote?",
            answer: "Navigate to the active election, review the candidates, select your choice, and confirm your vote. Your vote is encrypted and recorded on the blockchain."
        },
        {
            question: "Is my vote really secure?",
            answer: "Yes, all votes are encrypted using advanced cryptography and stored on a secure blockchain network. Your vote remains anonymous while being verifiable."
        },
        {
            question: "Can I change my vote after submitting?",
            answer: "Once submitted, votes cannot be changed to maintain election integrity. Please review your selections carefully before confirming."
        },
        {
            question: "How do I know my vote was counted?",
            answer: "After voting, you'll receive a unique transaction ID that you can use to verify your vote was recorded on the blockchain."
        },
        {
            question: "What if I encounter technical issues?",
            answer: "Contact our support team immediately through the Contact Us section. We provide 24/7 technical support during active elections."
        }
    ];

    const sections = [
        {
            id: "profile",
            title: "Profile Settings",
            icon: Settings,
            content: (
                <div className="bg-white p-6 rounded-lg border">
                    <p className="text-gray-600 mb-4">Manage your account settings, security preferences, and personal information.</p>
                    <button
                        onClick={() => window.location.href = '/profile'}
                        className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Go to Profile Settings
                    </button>
                </div>
            )
        },
        {
            id: "faq",
            title: "FAQ",
            icon: HelpCircle,
            content: (
                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border">
                            <h4 className="font-medium mb-2 text-gray-900">{item.question}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                        </div>
                    ))}
                </div>
            )
        },
        {
            id: "contact",
            title: "Contact Us",
            icon: MessageCircle,
            content: (
                <div className="bg-white p-6 rounded-lg border">
                    <h4 className="font-medium mb-4 text-gray-900">Contact Information</h4>
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="font-medium text-gray-700">Email Support</p>
                            <p className="text-indigo-600">support@votechain.com</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">Emergency Hotline</p>
                            <p className="text-indigo-600">1-800-VOTE-HELP</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">Business Hours</p>
                            <p className="text-gray-600">Mon-Fri: 8AM-8PM EST</p>
                            <p className="text-gray-600">Election Days: 24/7</p>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                            <p className="font-medium text-gray-700 mb-2">Response Times</p>
                            <p className="text-xs text-gray-600">• Critical issues: Within 1 hour</p>
                            <p className="text-xs text-gray-600">• General inquiries: Within 24 hours</p>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-4 py-6">
                {/* Expandable Sections */}
                <div className="space-y-4">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isExpanded = expandedSection === section.id;

                        return (
                            <div key={section.id} className="bg-white rounded-lg border overflow-hidden">
                                <button
                                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className="w-5 h-5 text-indigo-600" />
                                        <span className="font-medium text-gray-900">{section.title}</span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="p-4 border-t bg-gray-50">
                                        {section.content}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DashboardSidebar;