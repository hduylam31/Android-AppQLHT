import * as Crypto from 'expo-crypto';

class SecurityUtils{
    
    static async generateComplexSalt(rawSalt){
        const reversedStr = rawSalt.split('').reverse().join('');
        const slicedStr = reversedStr.substring(0, 4); 
        const repeatedStr = slicedStr.repeat(2); 
        const finalSalt = repeatedStr.substring(0, 6);
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