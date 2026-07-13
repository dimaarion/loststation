import './App.css'
import {generateMaze} from "./action.js";
import Game from "./Game.jsx";

function App() {
    const maze = generateMaze(20,10)
    return <Game maze={maze}/>

}

export default App
