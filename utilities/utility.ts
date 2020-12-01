var otpGenerator = require('otp-generator');
export class Utility {
    static getCompleteFileUploadingUrl(fileName: String) {
        fileName = fileName.replace('public/', '');
        return fileName;
    }
}