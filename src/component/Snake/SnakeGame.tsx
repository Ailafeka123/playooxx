import React,{useState,useEffect,useRef} from "react";
import style from '@/style/game/SnakeGame/SnakeGame.module.scss';
import Snake from "@/pages/Snake";
export default function SnakeGame(){
    //地圖 24*24
    //x and Y 對應 [x][y] 0 = 空 1 = 身體 2 = 頭 3 = 食物
    const [gameMap,setGameMap] = useState <number[][]> ( () => Array.from({length:24},()=>(Array(24).fill(0))));
    //是否開啟遊戲
    const [gameStart,setGameStart] = useState<Boolean> (false);
    //蛇頭 x = 12 , y = 12 
    const [snakeHead,setSnakeHead] = useState<number[]>( [-1,-1] );
    //方向 上 -1 0 下 1 0 左 0 -1 右 0 1 預設向上
    const snakeDirect = useRef<[number,number]> ([-1,0]);
    //上一次移動方向，避免直接迴轉撞身體 x = col , y = row
    const lastDirect  = useRef<[number,number]>([-1,0]);
    //移動速度 初始2/s 最高10/s 第二個為是否開啟移動
    const [snakeMove,setSnakeMove] = useState<[number,Boolean]> ([2,false]);
    //蛇身
    const [snakeBody,setSnakeBody] = useState<number[][]>( [ [-1,-1] ] );
    //最後尾巴
    const [snakeTail,setSnakeTail] = useState<number[]>([-1,-1]);
    //蛇食物
    const [food,setFood] = useState<number[]>([-1,-1]);
    //空陣列 用於放食物(所以需要立刻更新)
    const nullMap = useRef<number[][]> ( [ [] ] );
    //初始化與放置地圖
    useEffect(()=>{
        GameMapReSet();
    },[gameMap])
    //每次移動 將蛇身 蛇頭 與 蛇食 在地圖上畫上true;
    useEffect(()=>{
        //刷新地圖
        setGameMap(index=>{
            if(snakeHead === null)return index;
            //複製地圖
            const newMap : number[][] = index.map(col=>[...col]);
            //最後尾巴(消失) 抓取頭部 食物 身體顯示
            const [snakeHeadCol,snakeHeadRow] = snakeHead;
            const [foodCol,foodRow] = food;
            const body = snakeBody.map(bodyIndex => [...bodyIndex]);
            const [tailCol,tailRow] = snakeTail;
            if(tailCol !== -1){
                newMap[tailCol][tailRow] = 0;
            }
            if(snakeHeadCol !== -1){
                newMap[snakeHeadCol][snakeHeadRow] = 2;
                newMap[foodCol][foodRow] = 3;
                body.forEach(([bodyCol,bodyRow],key)=>{
                    newMap[bodyCol][bodyRow] = 1;
                })
            }
            
            return newMap;
        })
    },[snakeHead])
    //遊戲開啟時 設定蛇頭 蛇身 與蛇食的位置 以及設定移動
    useEffect(()=>{
        if(gameStart === true){
            setGameMap(() => Array.from({length:24},()=>(Array(24).fill(0))));
            setSnakeHead([12,12]);
            setSnakeBody([ [13,12] ]);
            setSnakeTail([-1,-1]);
            snakeDirect.current = [-1,0];
            newFood();
            setSnakeMove([2,true]);
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    },[gameStart])
    //移動控制 x = col  y = row
    const handleKeyDown = (event: KeyboardEvent) => {
        event.preventDefault();
        switch (event.key) {
            case 'ArrowUp':
                if(lastDirect.current[0] === 1 && lastDirect.current[1] === 0){
                    return;
                }
                snakeDirect.current = [-1,0];
                break;
            case 'ArrowDown':
                if(lastDirect.current[0] === -1 && lastDirect.current[1] === 0){
                    return;
                }
                snakeDirect.current = [1,0];
                break;
            case 'ArrowLeft':
                if(lastDirect.current[0] === 0 && lastDirect.current[1] === 1){
                    return;
                }
                snakeDirect.current =[0, -1];
                break;
            case 'ArrowRight':
                if(lastDirect.current[0] === 0 && lastDirect.current[1] === -1){
                    return;
                }
                snakeDirect.current = [0, 1];
                break;
        }
    };
    //每次移動 重新設定頭 身體 尾巴 食物 並利用頭部去刷新interval
    useEffect(()=>{
        let runTime :ReturnType<typeof setTimeout>;
        if(snakeMove[1] === true){
            runTime = setTimeout(() => {
                let [col,row] = snakeHead;
                let [newCol,newRow] = [col+snakeDirect.current[0], row+snakeDirect.current[1]];
                let endBoolean : number = 0;
                //撞到牆壁
                if(newCol < 0 || newCol >= 24 || newRow < 0 || newRow >= 24){
                    endBoolean = 1;  
                }
                //是否撞到身體 最後一節理論上不該咬到
                snakeBody.forEach(([bodyCol,bodyRow],key)=>{
                    if(newCol === bodyCol && newRow === bodyRow){
                        if(key === snakeBody.length-1)return;
                        endBoolean = 2;
                    }
                });
                //如果判定結束 則終止循環
                if(endBoolean !== 0){
                    setSnakeMove([0.5,false]);
                    setGameStart(false);
                    clearInterval(runTime);
                    alert(`遊戲結束 得分為${snakeBody.length-1}分 死因:${endBoolean===1?"撞到牆":"咬到自己"}`);
                    return;
                }
                //更新頭部位置
                setSnakeHead([newCol,newRow]);
                //計算移動方向 避免被撞
                lastDirect.current =[snakeDirect.current[0],snakeDirect.current[1]];
                //如果吃到食物
                if(newCol === food[0] && newRow === food[1]){
                    //增長身體 不刷新tail
                    setSnakeBody(index=>{
                        let bodyIndex = index.map(index=>[...index]);
                        bodyIndex.unshift([col,row]);
                        return bodyIndex;
                    })
                    // 刷新空陣列
                    let tempMap :number[][] = [];
                    for(let tempCol = 0 ; tempCol< 24; tempCol++){
                        for(let tempRow = 0 ; tempRow < 24; tempRow++){
                            tempMap.push([tempCol,tempRow]);
                        }
                    }
                    
                    //找新食物
                    newFood();
                    //提升速度
                    if(snakeBody.length == 2 ){
                        setSnakeMove([3,true]);
                    }else if(snakeBody.length === 5 ){
                        setSnakeMove([4,true]);
                    }else if(snakeBody.length === 7 ){
                        setSnakeMove([5,true]);
                    }else if(snakeBody.length === 9 ){
                        setSnakeMove([6,true]);
                    }
                    
                }else{
                    //把最後的snakeBody 丟到尾部 
                    let [tailCol,tailRow] = snakeBody[snakeBody.length-1];
                    setSnakeTail([tailCol,tailRow])
                    //刷新身體
                    setSnakeBody(index=>{
                        let bodyIndex = index.map(index=>[...index]);
                        bodyIndex.unshift([col,row]);
                        bodyIndex.pop();
                        return bodyIndex;
                    })
                }              
            }, (1000/snakeMove[0]) );
        }
        return ()=>clearTimeout(runTime);
    },[snakeMove,snakeHead])
    //設定新食物
    const newFood = () =>{
        let find:Boolean = false;
        while(find === false){
            const col:number = Math.floor(Math.random()*24);
            const row:number = Math.floor(Math.random()*24);
            if(gameMap[col][row] === 0){
                find = true;    
            }
            if(find === true){
                setFood([col,row])
            }
        }
    }
    //return 地圖
    const GameMapReSet = () =>{
        const gameMapDiv :React.ReactElement[] = [];
        let time = 0;
        const gameMapList :{ [key: number]: string } = {
            0:"",
            1:style.snakeBody,
            2:style.snakeHeader,
            3:style.food
        }
        for(let col = 0 ; col < gameMap.length; col++){
            const gameMapCol :React.ReactElement[] = [];
            for(let row = 0 ; row < gameMap[col].length; row++){
                gameMapCol.push(<div key={time} data-x={col} data-y={row} className={`${style.GameMapCell} ${gameMapList[gameMap[col][row]]}`}></div>);
                time++;
            }
            gameMapDiv.push(<div key={time} className={style.GameMapCol}>{gameMapCol}</div>)
            time++;
        }
        return <div className={style.GameMap}>{gameMapDiv}</div>;
    }

    return(
        <div className={style.game}>
            <GameMapReSet></GameMapReSet>
            <button className={ `${style.gameStartButton} bg-sky-300 hover:bg-sky-500 hover:not-focus:bg-sky-400 ${gameStart===true?style.gameActive:""}`  } onClick={()=>{setGameStart(true)}}>遊戲開始</button>
        </div>
    )
};