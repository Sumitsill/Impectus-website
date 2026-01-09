import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'bn';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        hero_title: "Healthcare",
        hero_subtitle: "Reimagined",
        hero_desc: "Connecting rural communities with specialist doctors through advanced telemedicine. Secure, fast, and accessible for everyone.",
        get_started: "Get Started",
        doctors_online: "Doctors Online",
        support_247: "24/7 Support",
        teleconsultation: "Teleconsultation",
        tele_desc: "HD Video calls optimized for low bandwidth.",
        mobile_first: "Mobile First",
        mobile_desc: "Accessible via app and responsive web portal.",
        secure_records: "Secure Records",
        secure_desc: "End-to-end encrypted patient health data.",
        login: "Login",
        download_app: "Download App",
        established_link: "Establish Link",
        clinical_protocol: "Clinical Protocol",
        access_system: "Access System",
        discovery_points: "Discovery Points",
        rx_suggestions: "Rx Suggestions",
        export_pdf: "Export Clinical PDF",
        symptoms: "Symptoms",
        years_exp: "Years of Experience",
        patients: "Patients",
        rating: "Rating",
        edit_profile: "Edit Profile",
        save_changes: "Save Changes",
        cancel: "Cancel",
        back_to_home: "Back to Home",
        admin_portal: "Admin Portal",
        admin_subtitle: "Enter your administrator credentials to continue",
        direct_access: "Direct Access",
        auth_disclaimer: "Authentication is secured with end-to-end JWT encryption.",
        // About & Contact
        about_title: "About Care4You",
        about_desc: "Bridging the gap between rural communities and advanced healthcare through technology.",
        mission_title: "Our Mission",
        mission_desc: "To ensure that every citizen, regardless of their location, has immediate access to quality medical consultation using our low-bandwidth optimized telemetry network.",
        for_patients: "For Patients",
        for_patients_desc: "Zero-cost access to specialists, digital records, and direct pharmacy links.",
        for_doctors: "For Doctors",
        for_doctors_desc: "Efficient triage tools and remote monitoring capabilities to manage rural health effectively.",
        contact_title: "Get in Touch",
        email_us: "Email Us",
        helpline: "Helpline",
        headquarters: "Headquarters",
        send_message: "Send Message",
        first_name: "First Name",
        last_name: "Last Name",
        email_address: "Email Address",
        message_placeholder: "How can we help you?",
        submit_request: "Submit Request",
        // Dashboards
        current_opd_load: "Current OPD Load",
        epidemic_watch: "Epidemic Watch",
        waiting_room: "Waiting Room",
        today_appointments: "Today's Appointments",
        patient_queue: "Patient Queue & Risk",
        priority_actions: "Priority Actions",
        panchakarma_active: "Panchakarma Active",
        daily_schedule: "Daily Schedule",
        patient_tracker: "Patient Tracker",
        repertory_search: "Repertory Search",
        practice_intelligence: "Practice Intelligence",
        // Navigation
        nav_overview: "Overview",
        nav_appointments: "Appointments",
        nav_schedule: "Schedule",
        nav_patients: "Patients",
        nav_consultations: "Consultations",
        nav_profile: "Profile",
        sign_out: "Sign Out",
        nav_home: "Home",
        nav_about: "About",
        nav_contact: "Contact",
        nav_admin: "Admin",
        contact_info: "Contact Information",
        education: "Education",
        certifications: "Certifications",
        reviews: "Reviews",
        professional_bio: "Professional Bio",
        registration: "Registration",
        communication: "Communication"
    },
    hi: {
        hero_title: "स्वास्थ्य सेवा",
        hero_subtitle: "पुनर्कल्पित",
        hero_desc: "उन्नत टेलीमेडिसिन के माध्यम से ग्रामीण समुदायों को विशेषज्ञ डॉक्टरों से जोड़ना। सभी के लिए सुरक्षित, तेज़ और सुलभ।",
        get_started: "शुरू करें",
        doctors_online: "डॉक्टर ऑनलाइन",
        support_247: "24/7 सहायता",
        teleconsultation: "टेली-परामर्श",
        tele_desc: "कम बैंडविड्थ के लिए अनुकूलित एचडी वीडियो कॉल।",
        mobile_first: "मोबाइल फर्स्ट",
        mobile_desc: "ऐप और रिस्पॉन्सिव वेब पोर्टल के माध्यम से सुलभ।",
        secure_records: "सुरक्षित रिकॉर्ड",
        secure_desc: "एंड-टू-एंड एन्क्रिप्टेड रोगी स्वास्थ्य डेटा।",
        login: "लॉगिन",
        download_app: "ऐप डाउनलोड करें",
        established_link: "लिंक स्थापित करें",
        clinical_protocol: "नैदानिक प्रोटोकॉल",
        access_system: "सिस्टम एक्सेस करें",
        discovery_points: "खोज बिंदु",
        rx_suggestions: "पर्चे के सुझाव",
        export_pdf: "क्लीनिकल पीडीएफ निर्यात करें",
        symptoms: "लक्षण",
        years_exp: "अनुभव के वर्ष",
        patients: "मरीज",
        rating: "रेटिंग",
        edit_profile: "प्रोफ़ाइल संपादित करें",
        save_changes: "परिवर्तन सहेजें",
        cancel: "रद्द करें",
        back_to_home: "मुख्य पृष्ठ पर वापस",
        admin_portal: "व्यवस्थापक पोर्टल",
        admin_subtitle: "जारी रखने के लिए अपनी व्यवस्थापक साख दर्ज करें",
        direct_access: "सीधी पहुंच",
        auth_disclaimer: "प्रमाणीकरण एंड-टू-एंड JWT एन्क्रिप्शन के साथ सुरक्षित है।",
        // About & Contact
        about_title: "Care4You के बारे में",
        about_desc: "तकनीक के माध्यम से ग्रामीण समुदायों और उन्नत स्वास्थ्य सेवा के बीच की खाई को पाटना।",
        mission_title: "हमारा मिशन",
        mission_desc: "यह सुनिश्चित करने के लिए कि प्रत्येक नागरिक, उनके स्थान की परवाह किए बिना, लो-बैंडविड्थ अनुकूलित टेलीमेट्री नेटवर्क का उपयोग करके बेहतर चिकित्सा परामर्श प्राप्त कर सके।",
        for_patients: "रोगियों के लिए",
        for_patients_desc: "विशेषज्ञों तक मुफ्त पहुंच, डिजिटल रिकॉर्ड और सीधे फार्मेसी लिंक।",
        for_doctors: "डॉक्टरों के लिए",
        for_doctors_desc: "ग्रामीण स्वास्थ्य को प्रभावी ढंग से प्रबंधित करने के लिए कुशल ट्राइएज उपकरण और रिमोट मॉनिटरिंग क्षमताएं।",
        contact_title: "संपर्क करें",
        email_us: "हमें ईमेल करें",
        helpline: "हेल्पलाइन",
        headquarters: "मुख्यालय",
        send_message: "संदेश भेजें",
        first_name: "पहला नाम",
        last_name: "अंतिम नाम",
        email_address: "ईमेल पता",
        message_placeholder: "हम आपकी क्या सहायता कर सकते हैं?",
        submit_request: "अनुरोध सबमिट करें",
        // Dashboards
        current_opd_load: "वर्तमान ओपीडी लोड",
        epidemic_watch: "महामारी की निगरानी",
        waiting_room: "प्रतीक्षा कक्ष",
        today_appointments: "आज की नियुक्तियां",
        patient_queue: "रोगी कतार और जोखिम",
        priority_actions: "प्राथमिकता क्रियाएं",
        panchakarma_active: "पंचकर्म सक्रिय",
        daily_schedule: "दैनिक अनुसूची",
        patient_tracker: "रोगी ट्रैकर",
        repertory_search: "रेपर्टरी खोज",
        practice_intelligence: "अभ्यास इंटेलिजेंस",
        // Navigation
        nav_overview: "अवलोकन",
        nav_appointments: "नियुक्तियां",
        nav_schedule: "अनुसूची",
        nav_patients: "मरीज",
        nav_consultations: "परामर्श",
        nav_profile: "प्रोफ़ाइल",
        sign_out: "साइन आउट",
        nav_home: "मुख्य पृष्ठ",
        nav_about: "हमारे बारे में",
        nav_contact: "संपर्क",
        nav_admin: "व्यवस्थापक",
        contact_info: "संपर्क जानकारी",
        education: "शिक्षा",
        certifications: "प्रमाणन",
        reviews: "समीक्षाएं",
        professional_bio: "व्यावसायिक जैव",
        registration: "पंजीकरण",
        communication: "संचार"
    },
    bn: {
        hero_title: "স্বাস্থ্যসেবা",
        hero_subtitle: "নতুন ভাবনা",
        hero_desc: "উন্নত টেলিমেডিসিনের মাধ্যমে গ্রামীণ সম্প্রদায়কে বিশেষজ্ঞ ডাক্তারদের সাথে সংযুক্ত করা। সবার জন্য নিরাপদ, দ্রুত এবং অ্যাক্সেসযোগ্য।",
        get_started: "শুরু করুন",
        doctors_online: "ডাক্তার অনলাইন",
        support_247: "২৪/৭ সহায়তা",
        teleconsultation: "টেলিকনসালটেশন",
        tele_desc: "লো ব্যান্ডউইথের জন্য অপ্টিমাইজ করা এইচডি ভিডিও কল।",
        mobile_first: "মোবাইল ফার্স্ট",
        mobile_desc: "অ্যাপ এবং রেসপনসিভ ওয়েব পোর্টালের মাধ্যমে অ্যাক্সেসযোগ্য।",
        secure_records: "সুরক্ষিত রেকর্ড",
        secure_desc: "এন্ড-টু-এন্ড এনক্রিপ্ট করা রোগীর স্বাস্থ্য ডেটা।",
        login: "লগইন",
        download_app: "অ্যাপ ডাউনলোড করুন",
        established_link: "লিঙ্ক স্থাপন করুন",
        clinical_protocol: "ক্লিনিকাল প্রোটোকল",
        access_system: "সিস্টেম অ্যাক্সেস করুন",
        discovery_points: "আবিষ্কার পয়েন্ট",
        rx_suggestions: "পরামর্শ",
        export_pdf: "ক্লিনিকাল পিডিএফ ডাউনলোড করুন",
        symptoms: "লক্ষণ",
        years_exp: "অভিজ্ঞতা",
        patients: "রোগী",
        rating: "রেটিং",
        edit_profile: "প্রোফাইল এডিট করুন",
        save_changes: "সেভ করুন",
        cancel: "বাতিল করুন",
        back_to_home: "হোমে ফিরে যান",
        admin_portal: "অ্যাডমিন পোর্টাল",
        admin_subtitle: "চালিয়ে যেতে আপনার অ্যাডমিনিস্ট্রেটর ক্রিডেনশিয়াল লিখুন",
        direct_access: "সরাসরি অ্যাক্সেস",
        auth_disclaimer: "প্রমাণীকরণ এন্ড-টু-এন্ড JWT এনক্রিপশন দিয়ে সুরক্ষিত।",
        // About & Contact
        about_title: "Care4You সম্পর্কে",
        about_desc: "প্রযুক্তির মাধ্যমে গ্রামীণ সম্প্রদায় এবং উন্নত স্বাস্থ্যসেবার মধ্যে ব্যবধান দূর করা।",
        mission_title: "আমাদের লক্ষ্য",
        mission_desc: "আমাদের লো-ব্যান্ডউইথ অপ্টিমাইজড টেলিমেট্রি নেটওয়ার্ক ব্যবহার করে প্রতিটি নাগরিকের উন্নত মানের চিকিৎসা পরামর্শ পাওয়ার সুযোগ নিশ্চিত করা।",
        for_patients: "রোগীদের জন্য",
        for_patients_desc: "বিশেষজ্ঞদের কাছে বিনামূল্যে অ্যাক্সেস, ডিজিটাল রেকর্ড এবং সরাসরি ফার্মেসি লিঙ্ক।",
        for_doctors: "ডাক্তারদের জন্য",
        for_doctors_desc: "গ্রামীণ স্বাস্থ্যকে কার্যকরভাবে পরিচালনা করার জন্য দক্ষ ট্রায়াজ সরঞ্জাম এবং দূরবর্তী পর্যবেক্ষণ ক্ষমতা।",
        contact_title: "যোগাযোগ করুন",
        email_us: "আমাদের ইমেল করুন",
        helpline: "হেল্পলাইন",
        headquarters: "সদর দপ্তর",
        send_message: "বার্তা পাঠান",
        first_name: "প্রথম নাম",
        last_name: "শেষ নাম",
        email_address: "ইমেল ঠিকানা",
        message_placeholder: "আমরা আপনাকে কিভাবে সাহায্য করতে পারি?",
        submit_request: "অনুরোধ জমা দিন",
        // Dashboards
        current_opd_load: "বর্তমান ওপিডি লোড",
        epidemic_watch: "মহামারী ওয়াচ",
        waiting_room: "ওয়েটিং রুম",
        today_appointments: "আজকের অ্যাপয়েন্টমেন্ট",
        patient_queue: "রোগীর কিউ এবং ঝুঁকি",
        priority_actions: "অগ্রাধিকার কর্ম",
        panchakarma_active: "পঞ্চকর্ম সক্রিয়",
        daily_schedule: "দৈনিক সময়সূচী",
        patient_tracker: "রোগী ট্র্যাকার",
        repertory_search: "রেপার্টরি অনুসন্ধান",
        practice_intelligence: "প্র্যাকটিস ইন্টেলিজেন্স",
        // Navigation
        nav_overview: "ওভারভিউ",
        nav_appointments: "অ্যাপয়েন্টমেন্ট",
        nav_schedule: "সময়সূচী",
        nav_patients: "রোগী",
        nav_consultations: "পরামর্শ",
        nav_profile: "প্রোফাইল",
        sign_out: "সাইন আউট",
        nav_home: "হোম",
        nav_about: "আমাদের সম্পর্কে",
        nav_contact: "যোগাযোগ",
        nav_admin: "অ্যাডমিন",
        contact_info: "যোগাযোগের তথ্য",
        education: "শিক্ষা",
        certifications: "সার্টিফিকেশন",
        reviews: "রিভিউ",
        professional_bio: "পেশাদার বায়ো",
        registration: "নিবন্ধন",
        communication: "যোগাযোগ মাধ্যম"
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem('language') as Language) || 'en';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
