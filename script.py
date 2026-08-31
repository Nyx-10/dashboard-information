import re

file_path = 'src/context/LanguageContext.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_keys = {
    'en': "overlayWelcomeTitle: 'Welcome Back!', overlayWelcomeDesc: 'To keep connected with us please login with your personal info', overlayHelloTitle: 'Hello, Friend!', overlayHelloDesc: 'Enter your personal details and start your journey with us', ",
    'ms': "overlayWelcomeTitle: 'Selamat Kembali!', overlayWelcomeDesc: 'Untuk terus berhubung dengan kami, sila log masuk dengan maklumat peribadi anda.', overlayHelloTitle: 'Helo Kawan!', overlayHelloDesc: 'Masukkan butiran peribadi anda dan mulakan perjalanan bersama kami.', ",
    'zh': "overlayWelcomeTitle: '欢迎回来！', overlayWelcomeDesc: '为了与我们保持联系，请使用您的个人信息登录。', overlayHelloTitle: '你好，朋友！', overlayHelloDesc: '输入您的个人详细信息，开始您的旅程。', ",
    'ta': "overlayWelcomeTitle: 'மீண்டும் வரவேற்கிறோம்!', overlayWelcomeDesc: 'எங்களுடன் இணைந்திருக்க தயவுசெய்து உங்கள் தனிப்பட்ட தகவல்களுடன் உள்நுழையவும்.', overlayHelloTitle: 'வணக்கம், நண்பரே!', overlayHelloDesc: 'உங்கள் தனிப்பட்ட விவரங்களை உள்ளிட்டு எங்களுடன் உங்கள் பயணத்தைத் தொடங்கவும்.', "
}

content = re.sub(r"(resolved: 'Resolved')(\s*)}", r"\1, " + new_keys['en'] + r"\2}", content, count=1)
content = re.sub(r"(returnToLogin: 'Kembali ke Log Masuk')(\s*)}", r"\1, " + new_keys['ms'] + r"\2}", content, count=1)
content = re.sub(r"(returnToLogin: '返回登录')(\s*)}", r"\1, " + new_keys['zh'] + r"\2}", content, count=1)
content = re.sub(r"(returnToLogin:\s*'.*?')(\s*)}", r"\1, " + new_keys['ta'] + r"\2}", content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
