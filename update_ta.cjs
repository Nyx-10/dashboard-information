const fs = require('fs');
let content = fs.readFileSync('src/context/LanguageContext.jsx', 'utf8');

const taIndex = content.indexOf('ta: {');
if (taIndex > -1) {
    const newKeysStart = content.indexOf('// New keys', taIndex);
    if (newKeysStart > -1) {
        const noInfoYetStart = content.indexOf('noInfoYet:', newKeysStart);
        if (noInfoYetStart > -1) {
            const before = content.substring(0, newKeysStart);
            const after = content.substring(noInfoYetStart);
            const replacement = `// New keys
      staySignedIn: 'உள்நுழைந்திருக்கவும் (Stay signed in)', loading: 'ஏற்றுகிறது (Loading)...', loginFailed: 'உள்நுழைவு தோல்வியுற்றது. மின்னஞ்சல் மற்றும் கடவுச்சொல்லை சரிபார்க்கவும்.',
      analyticsOverview: 'பகுப்பாய்வு கண்ணோட்டம்', monitorStats: 'தரவுத்தளத்திலிருந்து நேரடியாக கணினி புள்ளிவிவரங்களை கண்காணிக்கவும்.', totalUsers: 'மொத்த பயனர்கள்', totalReports: 'மொத்த அறிக்கைகள்', resolutionRate: 'தீர்வு விகிதம்', activeAccounts: 'செயலில் உள்ள கணக்குகள்', systemAuditLogs: 'கணினி தணிக்கை பதிவுகள்', adminActionRecords: 'நிர்வாகி மற்றும் கணினி செயல் பதிவுகள்.', exportLogs: 'பதிவுகளை ஏற்றுமதி செய்', action: 'செயல் (Action)', userEmail: 'பயனர் மின்னஞ்சல்', time: 'நேரம்', noLogRecords: 'தற்போது பதிவு பதிவுகள் இல்லை. (\\'audit_logs\\' அட்டவணையைச் சேர்க்கவும்)',
      noConversations: 'உரையாடல்கள் இல்லை.', selectConversation: 'செய்தியிடலைத் தொடங்க உரையாடலைத் தேர்ந்தெடுக்கவும்', online: 'நிகழ்நிலை', reportUser: 'பயனரைப் புகாரளி', reportType: 'அறிக்கை வகை', spam: 'ஸ்பேம்', scammer: 'மோசடி', inappropriate: 'பொருத்தமற்ற உள்ளடக்கம்', harassment: 'துன்புறுத்தல்', typeReason: 'காரணத்தைத் தட்டச்சு செய்க...', submit: 'சமர்ப்பி', send: 'அனுப்பு', justNow: 'இப்போது தான்',
      `;
            fs.writeFileSync('src/context/LanguageContext.jsx', before + replacement + after);
            console.log('Tamil replaced');
        }
    }
}
