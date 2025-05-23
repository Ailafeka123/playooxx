import React,{useState,useEffect} from "react";
import style from '@/style/play1_ooxx/ooxx.module.scss'
export default function OOXX(){
    //現在是誰的回合 1 = O , 2 = X
    let [newRound,setNewRound] = useState(1);
    //是否勝利
    let [win,setWin] = useState([false,0]);
    //獲勝條件 需要連幾個
    let [winNumber, setWinNumber] = useState(4);
    //棋盤數量 當前數量
    let [roundNumber, setRoundNumber] = useState([9,0])
    //設定棋盤大小
    let [limit, setLimit] = useState(5);
    // 0 = null , 1 = O , 2 = X
    let [checkerboard,setCheckerboard] = useState <number[][]> ([ [] ])
    //初始化棋盤 後續可能可以進行4X4系列
    const reStart = () =>{
        //棋盤大小
        let arrayList = Array.from({length:limit},()=> Array(limit).fill(0));
        setCheckerboard(arrayList);
        //棋盤最大數量
        setRoundNumber([limit*limit,0])
        //O先手
        setNewRound(1);
        //重製對決結果
        setWin([false,0]);
    }
    // 初始化 進行棋盤初始化
    useEffect(()=>{
        reStart();
    },[])
    //建立棋盤當前結果
    const CheckerboardShow = () =>{
        let pushDiv = [];
        let key = 0;
        for(let i = 0 ; i < checkerboard.length; i++){
            for(let row = 0 ; row < checkerboard[0].length ; row++){
                let index = "";
                if(checkerboard[i][row] === 1){
                    index = "O"
                }else if(checkerboard[i][row] === 2){
                    index = "X"
                }
                pushDiv.push(<div key={key} className={style.checkerBoard} data-value={checkerboard[i][row]} onClick={(e)=>{
                    let value = e.currentTarget.dataset.value;
                    if(value === "0" && win[0] === false){
                        ClickDiv(i,row)
                    }
                }}>{index}</div>)
                key++
            }
        }
        return (
            <div className={style.checkerBoardDiv} style={{ '--limit': limit } as React.CSSProperties}>
                {pushDiv}
            </div>
        );
    }
    //更新棋盤
    const ClickDiv = (i:number,j:number) =>{
        setCheckerboard(index=>(
            index.map((row,key)=>(
                key === i? row.map((cell,key2)=>(
                    key2 === j ? newRound : cell
                )):row
            ))
        ))
        //確認有沒有贏
        checkwin(i,j,newRound);
        //換手
        setNewRound(newRound===1? 2 : 1)
        setRoundNumber(index=>{
            return ([index[0],index[1]+1])
        })
    }
    //確認是否獲勝
    const checkwin = (col:number,row:number,Round:number)=>{
        //row確認 向左 向右
        let times = 1;
        for(let cell = row-1; cell >= 0 ; cell--){
            if(checkerboard[col][cell] === Round){
                times++;
            }else{
                break;
            }
        }
        for(let cell = row+1 ; cell < checkerboard[col].length; cell++){
            if(checkerboard[col][cell] === Round){
                times++;
            }else{
                break;
            }
        }
        if(times >= winNumber){
            setWin([true,Round])
            return;
        }
        times = 1;
        //col確認 向上 向下
        for(let cell = col-1 ;cell >= 0 ; cell--){
            if(checkerboard[cell][row] === Round){
                times++;
            }else{
                break;
            }
        }
        for(let cell = col +1 ; cell < checkerboard.length ; cell++){
            if(checkerboard[cell][row] === Round){
                times++;
            }else{
                break;
            }
        }
        if(times >= winNumber){
            setWin([true,Round])
            return;
        }
        times = 1;
        //斜向 左上 右下
        let cellCol = col-1;
        let cellRow = row-1;
        while(cellCol >= 0 && cellRow >= 0){
            if(checkerboard[cellCol][cellRow] === Round){
                times++;
            }else{
                break;
            }
            cellCol--;
            cellRow--;
        }
        cellCol = col+1;
        cellRow = row+1;
        while(cellCol < checkerboard.length && cellRow < checkerboard[col].length){
            if(checkerboard[cellCol][cellRow] === Round){
                times++;
            }else{
                break;
            }
            cellCol++;
            cellRow++;
        }
        if(times >= winNumber){
            setWin([true,Round])
            return;
        }
        times = 1;

        //斜向 右上 左下
        cellCol = col-1;
        cellRow = row+1;
        while(cellCol >= 0 && cellRow < checkerboard[row].length){
            if(checkerboard[cellCol][cellRow] === Round){
                times++;
            }else{
                break;
            }
            cellCol--;
            cellRow++;
        }
        cellCol = col+1;
        cellRow = row-1;
        while(cellCol < checkerboard.length && cellRow >= 0){
            if(checkerboard[cellCol][cellRow] === Round){
                times++;
            }else{
                break;
            }
            cellCol++;
            cellRow--;
        }
        if(times >= winNumber){
            setWin([true,Round])
            return;
        }

    }

    //目前結果或是誰先手
    const NowResult = () =>{
        if(win[0] === true){
            if(win[1] === 1){
                return(<h2 className={style.winnerDiv}>O 勝利</h2>)
            }else{
                return(<h2 className={style.winnerDiv}>X 勝利</h2>)
            }
        }else{
            if(roundNumber[0] === roundNumber[1]){
                return(<h2 className={style.winnerDiv}>平手</h2>)
            }else{
                return(<h2>現在回合:{newRound === 1 ? "O":"X"}</h2>)
            }
        }
    }
    //改變棋盤
    useEffect(()=>{
        reStart();
    },[limit,winNumber])

    //勝利所需的選擇器
    const WinNumberSelect = () =>{
        let option = [];
        for(let i = 3 ; i <= limit ;i++){
            option.push(<option key={i} value={i}>{i}</option>)
        }
        return (
            <select defaultValue={winNumber} onChange={(e)=>{
                let number = parseInt(e.target.value)
                setWinNumber(number)
            }}>
                {option}
            </select>
        )
    }
    //改變勝利所需連線數

    return(
        <div className={style.game}>
            <div className={style.gameBox}>
                
                <NowResult/>
                <CheckerboardShow/>
                <button onClick={()=>{reStart()}} className={style.reStartButton}>重新開始</button>
            </div>
            <div className={style.gameDirections}>
                <h1>井字遊戲</h1>
                <h2>遊戲說明:</h2>
                <p>輪流在棋格中畫O或X</p>
                <p>先將{winNumber}顆同符號連成一線（橫、直、斜）的人獲勝</p>
                <p>如果棋盤填滿且沒有人連成一線，則為平局</p>
                <h2>可進行設定:</h2>
                <div>
                    <label>當前棋盤大小:{limit}x{limit}</label>
                    <select defaultValue={limit} onChange={(e)=>{
                        let number = parseInt(e.target.value);
                        setLimit(number);
                        if(number < winNumber){
                            setWinNumber(number);
                        }
                    }}>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>                        
                    </select>
                </div>
                <div>
                    <label>勝利條件:連接{winNumber}個</label>
                    <WinNumberSelect/>
                </div>
            </div>
        </div>
    )
}