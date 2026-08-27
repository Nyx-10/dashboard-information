const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      const replacements = [
        { from: /alert\('Sila muat naik fail gambar sahaja \/ Please upload image files only\.'\);/g, to: "alert(t('alertInvalidFile'));" },
        { from: /alert\('Saiz gambar terlalu besar! Had maksimum ialah 5MB\. \/ File size exceeds 5MB limit\.'\);/g, to: "alert(t('alertFileSize'));" },
        { from: /alert\('Sila semak e-mel anda untuk mendapatkan kod OTP \(6 digit\)\.'\);/g, to: "alert(t('alertOtpSent'));" },
        { from: /alert\('Failed to submit report: ' \+ err\.message\);/g, to: "alert(t('alertFailedReport') + err.message);" },
        { from: /alert\('Failed to upload image: ' \+ error\.message\);/g, to: "alert(t('alertFailedUpload') + error.message);" },
        { from: /alert\('Failed to send message: ' \+ error\.message\);/g, to: "alert(t('alertFailedSendMsg') + error.message);" },
        { from: /alert\('Failed to delete item\.'\);/g, to: "alert(t('alertFailedDelete'));" }
      ];

      replacements.forEach(({from, to}) => {
        if (content.match(from)) {
          content = content.replace(from, to);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

replaceInDir('src');
