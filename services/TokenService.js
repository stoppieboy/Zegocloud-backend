let jwt = require("jsonwebtoken")
let uuid4 = require("uuid4")

class TokenService {
    static #app_access_key = process.env.APP_ACCESS_KEY;
    static #app_secret = process.env.APP_SECRET;
    #managementToken;

    constructor() {
        this.#managementToken = this.getManagementToken(true);
    }

    getManagementToken(forceNew){
        if(forceNew || this.#isTokenExpired(this.#managementToken)){
            let payload = {
                access_key: TokenService.#app_access_key,
                type: "management",
                version: 2,
                iat: Math.floor(Date.now() / 1000),
                nbf: Math.floor(Date.now() / 1000)
            };
            this.#managementToken = this.#signPayloadToToken(payload);
        }
        return this.#managementToken;
    }

    #signPayloadToToken(payload){
        let token = jwt.sign(
            payload,
            TokenService.#app_secret,
            {
                algorithm: 'HS256',
                expiresIn: '24h',
                jwtid: uuid4()
            }
        );
        return token;
    }

    #isTokenExpired(token){
        try {
            const { exp } = jwt.decode(token);
            const buffer = 30;
            const currTimeSeconds = Math.floor(Date.now() / 1000);
            return !exp || exp + buffer < currTimeSeconds
        } catch (error) {
            console.log("error in decoding token", err);
            return true;
        }
    }
}

module.exports = { TokenService };