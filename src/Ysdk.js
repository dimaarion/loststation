// Ysdk.js
export class Ysdk {
    constructor() {
        this.ysdk = null;
        this._initPromise = null;
    }

    async getInstance() {
        if (this.ysdk) return this.ysdk;
        if (this._initPromise) return this._initPromise;

        if (typeof YaGames === 'undefined') {
            throw new Error('YaGames SDK not found');
        }

        this._initPromise = YaGames.init().then(sdk => {
            this.ysdk = sdk;
            return sdk;
        });

        return this._initPromise;
    }

    async getLang() {
        const ysdk = await this.getInstance();
        const rawLang = ysdk?.environment?.i18n?.lang;
        const supported = ['ru', 'en', 'tr', 'es', 'pt', 'id', 'vi', 'ar'];
        return supported.includes(rawLang) ? rawLang : 'ru';
    }

    ready() {
        return this.getInstance().then(ysdk => {
            if (ysdk?.features?.LoadingAPI) {
                ysdk.features.LoadingAPI.ready();
            }
        });
    }
}
