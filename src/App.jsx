import './App.css'
import {generateMaze} from "./action.js";
import Game from "./Game.jsx";
import {useEffect, useState} from "react";
import {Ysdk} from "./Ysdk.js";
import Database from "./Database.js";




function App() {

    const [ysdkInstance, setYsdkInstance] = useState(null);
    const [settings, setSettings] = useState(null);
    const [progress, setProgress] = useState(null);
    const [lang, setLang] = useState('ru');
    const [maze, setMaze] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const isLocal = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
                let ysdkInstance = null;
                let lang = 'ru'; // Дефолтный язык
                let progress = {}; // Дефолтный прогресс

                if (!isLocal) {
                    // --- РЕАЛЬНЫЙ SDK (только для Яндекс Игр) ---
                    const sdkWrapper = new Ysdk();

                    // Инициализация
                    ysdkInstance = await sdkWrapper.getInstance();

                    // Язык
                    lang = await sdkWrapper.getLang();

                    // Прогресс игрока
                    const player = await ysdkInstance.getPlayer();
                    if (player) {
                        progress = await player.getData();
                    }

                    // Сообщаем платформе, что игра готова
                    await sdkWrapper.ready();
                } else {
                    // --- ЛОКАЛЬНАЯ РАЗРАБОТКА ---
                    console.log('[DEV] Запуск в режиме локальной разработки. SDK отключен.');
                    // Здесь можно явно подгрузить тестовые данные, если нужно
                    // progress = { level: 5, score: 100 };
                }

                // --- ОБЩАЯ ЛОГИКА (одинакова для обоих режимов) ---

                // Настройки из JsStore (твоя прошлая задача)
                const db = new Database();
                const localSettings = db.getAll() || {};

                // Генерация лабиринта
                const level = progress.level ?? 25;
                const gridSize = localSettings.gridSize ?? 25;
                const maze = generateMaze(gridSize, level);

                // Сохраняем состояние
                setYsdkInstance(ysdkInstance); // Будет null на локалке
                setLang(lang);
                setSettings(localSettings);
                setProgress(progress);
                setMaze(maze);

            } catch (err) {
                console.error('Критическая ошибка инициализации:', err);
                setError(err.message);
            }
        })();
    }, []);


    return maze?<Game maze={maze}/>:""

}

export default App
