import { createContext } from 'react';
export const LanguageContext = createContext();

export const dict = {
  en: {
    dashboard: 'Dashboard', searchItems: 'Search Items', missingItem: 'Missing Item & College Info', messages: 'Messages',
    adminPanel: 'ADMIN PANEL', analytics: 'Analytics', manageUsers: 'Manage Users', manageReports: 'Manage Reports', auditLogs: 'Audit Logs',
    profile: 'Profile', logout: 'Logout', searchAnything: 'Search anything...', notifications: 'Notifications', infoOnly: 'Information Only',
    recentlyReported: 'Recently Reported', welcomeBack: 'Welcome back, here are the recent items in the network.', searchResults: 'Search Results',
    all: 'All', lostItems: 'Lost Items', foundItems: 'Found Items', recentlyInfo: 'Recently Information', noItemsFound: 'No items found',
    contactReporter: 'Contact Reporter', myReports: 'My Reports', languageSettings: 'Language Settings', english: 'English', malay: 'Bahasa Melayu', chinese: '中文', tamil: 'தமிழ்',
    logoutConfirm: 'Log Out?', logoutMsg: 'Are you sure you want to log out of the system?', cancel: 'Cancel', searchName: 'Search name...',
    reportTitle: 'College Missing Item & Information Report', reportTypeField: 'Report Type', typeLost: 'I lost something', typeFound: 'I found something',
    typeInfo: 'For information only', typeOthers: 'Others', itemName: 'Item Name', itemNamePlaceholder: 'e.g. Blue Backpack', date: 'Date', location: 'Location',
    locationPlaceholder: 'Where was it?', description: 'Description', descriptionPlaceholder: 'Provide more details to help identify the item...',
    photo: 'Photo', photoUpload: 'Click to upload or drag and drop image', submitReport: 'Submit Report',
    // Login & Landing page keys
    loginTitle: 'Login', loginWelcome: 'Welcome to Dashboard Adtec Melaka.', emailLabel: 'Email', passwordLabel: 'Password',
    forgotPassword: 'Forgot Password?', signInBtn: 'Sign In', noAccount: 'Don\'t have an account?', signUpBtn: 'Sign Up',
    featuresTab: 'Features', statsTab: 'Stats', howToTab: 'How to Use', loginBtn: 'Login', heroBadge: 'Adtec Melaka Official Platform',
    heroTitle: 'Information Dashboard', heroSubtitle: 'Lost & found management, college information, and student communication in one modern and secure platform.',
    startNow: 'Start Now', learnMore: 'Learn More',
    // Forgot Password keys
    forgotTitle: 'Forgot Password', forgotDesc: 'Enter your email and we will send a link to reset your password.', sendLinkBtn: 'Send Link', linkSentTitle: 'Link Sent!', linkSentDesc: 'Please check your email inbox for further instructions.', backToLoginBtn: 'Back to Login',
    // Signup keys
    signupTitle: 'Create Account', signupDesc: 'Join the Adtec Melaka network.', fullNameLabel: 'Full Name', alreadyAccount: 'Already have an account?', confirmPasswordLabel: 'Confirm Password', passwordMismatchError: 'Passwords do not match', backToHome: 'Back to Home', passwordShortError: 'Password must be at least 8 characters',
    // New keys
    noConversations: 'No conversations.', selectConversation: 'Select a conversation to start messaging', online: 'Online', reportUser: 'Report User', reportType: 'Report Type', spam: 'Spam', scammer: 'Scammer', inappropriate: 'Inappropriate Content', harassment: 'Harassment', typeReason: 'Type reason...', submit: 'Submit', send: 'Send', justNow: 'Just now',
    noInfoYet: 'No announcements yet.', noReportsYet: 'No lost/found reports yet.', newReport: 'New Report:', noNewNotifications: 'No new notifications.',
    myProfile: 'My Profile', nameLabel: 'Name', roleLabel: 'Role', memberSince: 'Member since', loadingReports: 'Loading reports...', noReportsMade: 'You haven\'t reported any items yet.', saving: 'Saving...', messagingComingSoon: 'Messaging system coming soon!',
    alertFillRequired: 'Please fill in the required fields (Name, Date, Location).', alertFillInfo: 'Please fill in the date and description for this info.', defaultInfoTitle: 'Information', defaultLocation: 'General', alertSuccessAdd: 'Successfully added!', alertFailedAdd: 'Failed to add data: ',
    badgeLost: 'Lost', badgeFound: 'Found', badgeInfo: 'Info', normalUser: 'Normal User', today: 'Today', messageFrom: 'Message from', deleteBtn: 'Delete', cannotContactSelf: 'You cannot contact yourself.'
  },
  ms: {
    dashboard: 'Papan Pemuka', searchItems: 'Cari Barang', missingItem: 'Barang Hilang & Info Kolej', messages: 'Mesej',
    adminPanel: 'PANEL ADMIN', analytics: 'Analitik', manageUsers: 'Urus Pengguna', manageReports: 'Urus Laporan', auditLogs: 'Log Audit',
    profile: 'Profil', logout: 'Log Keluar', searchAnything: 'Cari apa-apa sahaja...', notifications: 'Notifikasi', infoOnly: 'Maklumat Sahaja',
    recentlyReported: 'Laporan Terkini', welcomeBack: 'Selamat kembali, ini adalah maklumat terkini di dalam rangkaian.', searchResults: 'Hasil Carian',
    all: 'Semua', lostItems: 'Barang Hilang', foundItems: 'Barang Jumpa', recentlyInfo: 'Maklumat Terkini', noItemsFound: 'Tiada item dijumpai',
    contactReporter: 'Hubungi Pelapor', myReports: 'Laporan Saya', languageSettings: 'Tetapan Bahasa', english: 'Bahasa Inggeris', malay: 'Bahasa Melayu', chinese: '中文', tamil: 'தமிழ்',
    logoutConfirm: 'Log Keluar?', logoutMsg: 'Adakah anda pasti ingin log keluar daripada sistem?', cancel: 'Batal', searchName: 'Cari nama...',
    reportTitle: 'Laporan Barang Hilang & Maklumat Kolej', reportTypeField: 'Jenis Laporan', typeLost: 'Saya kehilangan barang', typeFound: 'Saya terjumpa barang',
    typeInfo: 'Untuk maklumat sahaja', typeOthers: 'Lain-lain', itemName: 'Nama Barang', itemNamePlaceholder: 'cth. Beg Galas Biru', date: 'Tarikh', location: 'Lokasi',
    locationPlaceholder: 'Di manakah lokasinya?', description: 'Penerangan', descriptionPlaceholder: 'Berikan maklumat lanjut tentang barang tersebut...',
    photo: 'Gambar', photoUpload: 'Klik untuk muat naik atau letak gambar di sini', submitReport: 'Hantar Laporan',
    // Login & Landing page keys
    loginTitle: 'Log Masuk', loginWelcome: 'Selamat datang ke Dashboard Adtec Melaka.', emailLabel: 'E-mel', passwordLabel: 'Kata Laluan',
    forgotPassword: 'Lupa Kata Laluan?', signInBtn: 'Log Masuk', noAccount: 'Belum ada akaun?', signUpBtn: 'Daftar',
    featuresTab: 'Ciri-ciri', statsTab: 'Statistik', howToTab: 'Cara Guna', loginBtn: 'Log Masuk', heroBadge: 'Platform Rasmi Adtec Melaka',
    heroTitle: 'Dashboard Maklumat', heroSubtitle: 'Sistem pengurusan barang hilang & jumpa, maklumat kolej, dan komunikasi antara pelajar dalam satu platform yang moden dan selamat.',
    startNow: 'Mula Sekarang', learnMore: 'Ketahui Lebih',
    // Forgot Password keys
    forgotTitle: 'Lupa Kata Laluan', forgotDesc: 'Masukkan e-mel anda dan kami akan menghantar pautan untuk menetapkan semula kata laluan.', sendLinkBtn: 'Hantar Pautan', linkSentTitle: 'Pautan telah dihantar!', linkSentDesc: 'Sila semak peti masuk e-mel anda untuk arahan selanjutnya.', backToLoginBtn: 'Kembali ke Log Masuk',
    // Signup keys
    signupTitle: 'Cipta Akaun', signupDesc: 'Sertai rangkaian Adtec Melaka.', fullNameLabel: 'Nama Penuh', alreadyAccount: 'Sudah mempunyai akaun?', confirmPasswordLabel: 'Sahkan Kata Laluan', passwordMismatchError: 'Kata laluan tidak sepadan', backToHome: 'Kembali ke Laman Utama', passwordShortError: 'Kata laluan mestilah sekurang-kurangnya 8 aksara',
    // New keys
    noConversations: 'Tiada perbualan.', selectConversation: 'Pilih perbualan untuk mula mesej', online: 'Dalam talian', reportUser: 'Laporkan Pengguna', reportType: 'Jenis Laporan', spam: 'Spam', scammer: 'Penipu (Scammer)', inappropriate: 'Kandungan Tidak Sesuai', harassment: 'Gangguan', typeReason: 'Taip sebab...', submit: 'Hantar', send: 'Hantar', justNow: 'Baru sahaja',
    noInfoYet: 'Tiada pengumuman setakat ini.', noReportsYet: 'Tiada laporan barang hilang/jumpa setakat ini.', newReport: 'Laporan Baru:', noNewNotifications: 'Tiada notifikasi baru.',
    myProfile: 'Profil Saya', nameLabel: 'Nama', roleLabel: 'Peranan', memberSince: 'Ahli sejak', loadingReports: 'Sedang memuatkan laporan...', noReportsMade: 'Anda belum melaporkan sebarang item lagi.', saving: 'Sedang menyimpan...', messagingComingSoon: 'Sistem pemesejan dengan pemilik akan datang!',
    alertFillRequired: 'Sila isikan medan yang diwajibkan (Nama, Tarikh, Lokasi).', alertFillInfo: 'Sila isikan tarikh dan penerangan untuk maklumat ini.', defaultInfoTitle: 'Maklumat', defaultLocation: 'Umum', alertSuccessAdd: 'Berjaya ditambah!', alertFailedAdd: 'Gagal menambah data: ',
    badgeLost: 'Hilang', badgeFound: 'Jumpa', badgeInfo: 'Info', normalUser: 'Pengguna Biasa', today: 'Hari ini', messageFrom: 'Mesej dari', deleteBtn: 'Padam', cannotContactSelf: 'Anda tidak boleh menghubungi diri sendiri.'
  },
  zh: {
    dashboard: '仪表板', searchItems: '搜索物品', missingItem: '遗失物品与学院信息', messages: '消息',
    adminPanel: '管理面板', analytics: '分析', manageUsers: '管理用户', manageReports: '管理报告', auditLogs: '审计日志',
    profile: '个人资料', logout: '注销', searchAnything: '搜索任何内容...', notifications: '通知', infoOnly: '仅供参考',
    recentlyReported: '最近报告', welcomeBack: '欢迎回来，以下是网络中的最新物品。', searchResults: '搜索结果',
    all: '全部', lostItems: '遗失物品', foundItems: '寻获物品', recentlyInfo: '最新信息', noItemsFound: '未找到物品',
    contactReporter: '联系报告者', myReports: '我的报告', languageSettings: '语言设置', english: 'English', malay: 'Bahasa Melayu', chinese: '中文', tamil: 'தமிழ்',
    logoutConfirm: '注销？', logoutMsg: '您确定要退出系统吗？', cancel: '取消', searchName: '搜索名称...',
    reportTitle: '学院遗失物品与信息报告', reportTypeField: '报告类型', typeLost: '我丢失了东西', typeFound: '我找到了东西',
    typeInfo: '仅供参考', typeOthers: '其他', itemName: '物品名称', itemNamePlaceholder: '例如 蓝色背包', date: '日期', location: '地点',
    locationPlaceholder: '在哪里？', description: '描述', descriptionPlaceholder: '提供更多详细信息以帮助识别物品...',
    photo: '照片', photoUpload: '点击上传或拖放图片', submitReport: '提交报告',
    // Login & Landing page keys
    loginTitle: '登录', loginWelcome: '欢迎来到马六甲 Adtec 仪表板。', emailLabel: '电子邮件', passwordLabel: '密码',
    forgotPassword: '忘记密码？', signInBtn: '登录', noAccount: '还没有账号？', signUpBtn: '注册',
    featuresTab: '功能', statsTab: '统计', howToTab: '如何使用', loginBtn: '登录', heroBadge: '马六甲 Adtec 官方平台',
    heroTitle: '信息仪表板', heroSubtitle: '在一个现代安全平台上进行失物招领管理、学院信息及学生沟通。',
    startNow: '现在开始', learnMore: '了解更多',
    // Forgot Password keys
    forgotTitle: '忘记密码', forgotDesc: '输入您的电子邮件，我们将发送重置密码的链接。', sendLinkBtn: '发送链接', linkSentTitle: '链接已发送！', linkSentDesc: '请检查您的电子邮件收件箱以获取进一步指示。', backToLoginBtn: '返回登录',
    // Signup keys
    signupTitle: '创建账号', signupDesc: '加入马六甲 Adtec 网络。', fullNameLabel: '全名', alreadyAccount: '已有账号？', confirmPasswordLabel: '确认密码', passwordMismatchError: '密码不匹配', backToHome: '返回主页', passwordShortError: '密码必须至少为8个字符',
    // New keys
    noConversations: '没有对话。', selectConversation: '选择一个对话开始聊天', online: '在线', reportUser: '举报用户', reportType: '举报类型', spam: '垃圾信息', scammer: '骗子', inappropriate: '不当内容', harassment: '骚扰', typeReason: '输入原因...', submit: '提交', send: '发送', justNow: '刚刚',
    noInfoYet: '暂无公告。', noReportsYet: '暂无失物招领报告。', newReport: '新报告：', noNewNotifications: '没有新通知。',
    myProfile: '我的资料', nameLabel: '姓名', roleLabel: '角色', memberSince: '注册时间', loadingReports: '正在加载报告...', noReportsMade: '您还没有报告任何物品。', saving: '正在保存...', messagingComingSoon: '与所有者的消息系统即将推出！',
    alertFillRequired: '请填写必填字段（名称，日期，位置）。', alertFillInfo: '请填写此信息的日期和描述。', defaultInfoTitle: '信息', defaultLocation: '一般', alertSuccessAdd: '添加成功！', alertFailedAdd: '添加数据失败：',
    badgeLost: '丢失', badgeFound: '寻获', badgeInfo: '信息', normalUser: '普通用户', today: '今天', messageFrom: '来自', deleteBtn: '删除', cannotContactSelf: '您不能联系自己。'
  },
  ta: {
    dashboard: 'டாஷ்போர்டு', searchItems: 'பொருட்களைத் தேடு', missingItem: 'காணாமல் போன பொருள் & கல்லூரி தகவல்', messages: 'செய்திகள்',
    adminPanel: 'நிர்வாக குழு', analytics: 'பகுப்பாய்வு', manageUsers: 'பயனர்களை நிர்வகி', manageReports: 'அறிக்கைகளை நிர்வகி', auditLogs: 'தணிக்கை பதிவுகள்',
    profile: 'சுயவிவரம்', logout: 'வெளியேறு', searchAnything: 'எதையும் தேடுங்கள்...', notifications: 'அறிவிப்புகள்', infoOnly: 'தகவல் மட்டும்',
    recentlyReported: 'சமீபத்திய அறிக்கைகள்', welcomeBack: 'மீண்டும் வரவேற்கிறோம், நெட்வொர்க்கில் உள்ள சமீபத்திய பொருட்கள் இங்கே.', searchResults: 'தேடல் முடிவுகள்',
    all: 'அனைத்தும்', lostItems: 'தொலைந்த பொருட்கள்', foundItems: 'கிடைத்த பொருட்கள்', recentlyInfo: 'சமீபத்திய தகவல்', noItemsFound: 'பொருட்கள் எதுவும் கிடைக்கவில்லை',
    contactReporter: 'அறிக்கையாளரைத் தொடர்பு கொள்', myReports: 'எனது அறிக்கைகள்', languageSettings: 'மொழி அமைப்புகள்', english: 'English', malay: 'Bahasa Melayu', chinese: '中文', tamil: 'தமிழ்',
    logoutConfirm: 'வெளியேறவா?', logoutMsg: 'நீங்கள் கணினியிலிருந்து வெளியேற விரும்புகிறீர்களா?', cancel: 'ரத்து', searchName: 'பெயரைத் தேடு...',
    reportTitle: 'கல்லூரி காணாமல் போன பொருள் & தகவல் அறிக்கை', reportTypeField: 'அறிக்கை வகை', typeLost: 'நான் ஏதாவது இழந்தேன்', typeFound: 'நான் ஏதாவது கண்டேன்',
    typeInfo: 'தகவலுக்கு மட்டும்', typeOthers: 'மற்றவை', itemName: 'பொருளின் பெயர்', itemNamePlaceholder: 'எ.கா. நீல பின்பை', date: 'தேதி', location: 'இடம்',
    locationPlaceholder: 'எங்கே இருந்தது?', description: 'விவரம்', descriptionPlaceholder: 'பொருளை அடையாளம் காண மேலும் விவரங்களை வழங்கவும்...',
    photo: 'புகைப்படம்', photoUpload: 'பதிவேற்ற கிளிக் செய்யவும் அல்லது படத்தை இழுத்து விடவும்', submitReport: 'அறிக்கையை சமர்ப்பி',
    // Login & Landing page keys
    loginTitle: 'உள்நுழைய', loginWelcome: 'Adtec Melaka டாஷ்போர்டுக்கு வரவேற்கிறோம்.', emailLabel: 'மின்னஞ்சல்', passwordLabel: 'கடவுச்சொல்',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?', signInBtn: 'உள்நுழைய', noAccount: 'கணக்கு இல்லையா?', signUpBtn: 'பதிவு செய்',
    featuresTab: 'அம்சங்கள்', statsTab: 'புள்ளிவிவரங்கள்', howToTab: 'எப்படி பயன்படுத்துவது', loginBtn: 'உள்நுழைய', heroBadge: 'Adtec Melaka அதிகாரப்பூர்வ தளம்',
    heroTitle: 'தகவல் டாஷ்போர்டு', heroSubtitle: 'காணாமல் போன பொருட்கள் நிர்வாகம், கல்லூரி தகவல் மற்றும் மாணவர் தொடர்பு ஆகியவற்றை உள்ளடக்கிய நவீன பாதுகாப்பான தளம்.',
    startNow: 'தொடங்க', learnMore: 'மேலும் அறிய',
    // Forgot Password keys
    forgotTitle: 'கடவுச்சொல் மறந்துவிட்டதா', forgotDesc: 'உங்கள் மின்னஞ்சலை உள்ளிடவும், கடவுச்சொல்லை மீட்டமைக்க நாங்கள் ஒரு இணைப்பை அனுப்புவோம்.', sendLinkBtn: 'இணைப்பை அனுப்பு', linkSentTitle: 'இணைப்பு அனுப்பப்பட்டது!', linkSentDesc: 'மேலும் அறிவுறுத்தல்களுக்கு உங்கள் மின்னஞ்சலைச் சரிபார்க்கவும்.', backToLoginBtn: 'உள்நுழைவுக்குத் திரும்பு',
    // Signup keys
    signupTitle: 'கணக்கை உருவாக்கு', signupDesc: 'Adtec Melaka நெட்வொர்க்கில் சேரவும்.', fullNameLabel: 'முழு பெயர்', alreadyAccount: 'ஏற்கனவே கணக்கு உள்ளதா?', confirmPasswordLabel: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்', passwordMismatchError: 'கடவுச்சொற்கள் பொருந்தவில்லை', backToHome: 'முகப்புப்பக்கத்திற்குத் திரும்பு', passwordShortError: 'கடவுச்சொல் குறைந்தபட்சம் 8 எழுத்துக்கள் இருக்க வேண்டும்',
    // New keys
    noConversations: 'உரையாடல்கள் இல்லை.', selectConversation: 'செய்தியனுப்ப உரையாடலைத் தேர்ந்தெடுக்கவும்', online: 'ஆன்லைன்', reportUser: 'பயனரைப் புகாரளி', reportType: 'புகார் வகை', spam: 'ஸ்பேம்', scammer: 'மோசடி', inappropriate: 'பொருத்தமற்ற உள்ளடக்கம்', harassment: 'துன்புறுத்தல்', typeReason: 'காரணத்தை தட்டச்சு செய்க...', submit: 'சமர்ப்பி', send: 'அனுப்பு', justNow: 'இப்போது',
    noInfoYet: 'அறிவிப்புகள் எதுவும் இல்லை.', noReportsYet: 'காணாமல் போன/கிடைத்த பொருட்கள் எதுவும் இல்லை.', newReport: 'புதிய அறிக்கை:', noNewNotifications: 'புதிய அறிவிப்புகள் இல்லை.',
    myProfile: 'எனது சுயவிவரம்', nameLabel: 'பெயர்', roleLabel: 'பங்கு', memberSince: 'உறுப்பினர் முதல்', loadingReports: 'அறிக்கைகளை ஏற்றுகிறது...', noReportsMade: 'நீங்கள் இன்னும் எந்தப் பொருளையும் புகாரளிக்கவில்லை.', saving: 'சேமிக்கிறது...', messagingComingSoon: 'உரிமையாளருடனான செய்தி அமைப்பு விரைவில் வரும்!',
    alertFillRequired: 'தேவையான தகவல்களைப் பூர்த்தி செய்யவும் (பெயர், தேதி, இடம்).', alertFillInfo: 'இந்த தகவலுக்கான தேதி மற்றும் விளக்கத்தைப் பூர்த்தி செய்யவும்.', defaultInfoTitle: 'தகவல்', defaultLocation: 'பொதுவானவை', alertSuccessAdd: 'வெற்றிகரமாக சேர்க்கப்பட்டது!', alertFailedAdd: 'தரவைச் சேர்க்க முடியவில்லை: ',
    badgeLost: 'தொலைந்தவை', badgeFound: 'கிடைத்தவை', badgeInfo: 'தகவல்', normalUser: 'சாதாரண பயனர்', today: 'இன்று', messageFrom: 'இருந்து செய்தி', deleteBtn: 'அழி', cannotContactSelf: 'உங்களை நீங்கள் தொடர்புகொள்ள முடியாது.'
  }
};
