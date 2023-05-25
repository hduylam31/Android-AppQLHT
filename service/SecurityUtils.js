import * as Crypto from 'expo-crypto';

class SecurityUtils{
    
    static async generateComplexSalt(rawSalt){
        const n = rawSalt.length > 18 ? 3 : 2
        const reversedStr = rawSalt.split('').reverse().join('');
        let result = "";
        for (let i = 0; i < reversedStr.length; i++) {
            if (i % n !== 0) { 
                result += reversedStr[i];
            }
        }
        const finalSalt = result.repeat(2); 
        return finalSalt; 
    }

    static async encrypt(password, rawSalt){
        const saltPassword = await this.generateComplexSalt(password + rawSalt);
        console.log("saltPassword: ", saltPassword);
        return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, saltPassword);
    }

    static async compareHash(password, rawSalt, hashPassword) {
        const encrypt = this.encrypt(password, rawSalt);
        return encrypt === hashPassword;
      }
}

export default SecurityUtils;