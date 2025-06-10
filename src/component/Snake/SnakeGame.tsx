import React,{useState,useEffect} from "react";
import style from '@/style/game/SnakeGame/SnakeGame.module.scss';
export default function SnakeGame(){
    //地圖 24*24
    //x and Y 對應 [x][y]
    const [gameMap,setGameMap] = useState <Boolean[][]> ( () => Array.from({length:24},()=>(Array(24).fill(false))));
    //蛇頭
    const [snakeHead,setSnakeHead] = useState([]);
    //初始化與放置地圖
    useEffect(()=>{
        GameMapReSet();
    },[gameMap])
    useEffect(()=>{
        
    },[snakeHead])
    //return 地圖
    const GameMapReSet = () =>{
        const gameMapDiv :React.ReactElement[] = [];
        let time = 0;
        for(let col = 0 ; col < gameMap.length; col++){
            const gameMapCol :React.ReactElement[] = [];
            for(let row = 0 ; row < gameMap[col].length; row++){
                gameMapCol.push(<div key={time} data-x={col} data-y={row} className={style.GameMapCell}></div>);
                time++;
            }
            gameMapDiv.push(<div className={style.GameMapCol}>{gameMapCol}</div>)
        }
        return <div className={style.GameMap}>{gameMapDiv}</div>;
    }

    return(
        <>
            <GameMapReSet></GameMapReSet>
        </>
    )
};