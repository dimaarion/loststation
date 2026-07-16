export default class Database {
    constructor() {
        this.name = 'loststation';
        this.init();
    }

    init() {
        const stored = window.localStorage.getItem(this.name);
        if (!stored) {
            this.save({ score: 0, level: 1, music: 0.5, effect: 0.8 });
            return;
        }

        try {
            const parsed = JSON.parse(stored);
            // Простая валидация: если структура не та — сброс на дефолт
            if (typeof parsed.score !== 'number' || typeof parsed.level !== 'number') {
                this.save({ score: 0, level: 1, music: 0.5, effect: 0.8 });
                return;
            }
            // Если всё ок — ничего не делаем, данные уже в localStorage
        } catch (e) {
            console.warn('Database: corrupted data, resetting', e);
            this.save({ score: 0, level: 1, music: 0.5, effect: 0.8 });
        }
    }

    getAll() {
        const raw = window.localStorage.getItem(this.name);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    // Универсальный сеттер: атомарно обновляет и сохраняет
    update(updates) {
        const current = this.getAll() || { score: 0, level: 1, music: 0.5, effect: 0.8 };
        const next = { ...current, ...updates };
        this.save(next);
        return next;
    }

    save(data) {
        window.localStorage.setItem(this.name, JSON.stringify(data));
    }

    setLevel(level = 1) {
        return this.update({ level });
    }

    setScore(score = 0) {
        return this.update({ score });
    }

    setMusic(music = 0.5) {
        return this.update({ music });
    }

    setEffect(effect = 0.8) {
        return this.update({ effect });
    }

    remove() {
        window.localStorage.removeItem(this.name);
    }
}
