import React,{useState,useEffect} from "react";
import style from '@/style/play1_ooxx/ooxx.module.scss'
export default function OOXX(){
    //現在是誰的回合 1 = O , 2 = X
    const [newRound,setNewRound] = useState(1);
    //是否勝利
    const [win,setWin] = useState([false,0]);
    //獲勝條件 需要連幾個
    const [winNumber, setWinNumber] = useState(4);
    //棋盤數量 當前數量
    const [roundNumber, setRoundNumber] = useState([9,0])
    //設定棋盤大小
    const [limit, setLimit] = useState(5);
    // 0 = null , 1 = O , 2 = X
    const [checkerboard,setCheckerboard] = useState <number[][]> ([ [] ])
    //當前模式 false = 雙人模式 true = 電腦模式
    const [gameMod, setGameMode] = useState(false);
    //判斷盤面下棋位置 強化電腦判斷
    const [computer,setComputer] = useState<number[][]> ( [ [] ] )
    //初始化棋盤 後續可能可以進行4X4系列
    const reStart = () =>{
        //棋盤大小
        const arrayList = Array.from({length:limit},()=> Array(limit).fill(0));
        setCheckerboard(arrayList);
        const arrayList2 = Array.from({length:limit},()=> Array(limit).fill(0));
        setComputer(arrayList2)
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
        const pushDiv = [];
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
                    const value = e.currentTarget.dataset.value;
                    if(value === "0" && win[0] === false){
                        if(gameMod && newRound === 2){
                            return;
                        }
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
    //下棋後更新棋盤與判斷
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
        //計算下棋數量
        setRoundNumber(index=>{
            return ([index[0],index[1]+1])
        })
    }
    //確認是否獲勝 以及電腦判斷
    const checkwin = (col:number,row:number,Round:number)=>{
        //更新電腦判斷
        let computerArray = computer.map(index=>[...index])
        //row確認 向左 向右
        let times = 1;
        let linkCheck = true;
        for(let cell = row-1; cell >= 0 ; cell--){
            if(linkCheck){
                if(checkerboard[col][cell] === Round){
                    times++;
                    continue;
                }else{
                    linkCheck = false;
                    if(Round === 2){
                        break;
                    }
                }
            }
            if(checkerboard[col][cell] === 2){
                break;
            }else if(checkerboard[col][cell] === 1){
                if(checkerboard[col][cell+1] === 0){
                    computerArray[col][cell+1] += 5;
                }
            }else{
                computerArray[col][cell] += 1;
            }
        }
        linkCheck = true;
        for(let cell = row+1 ; cell < checkerboard[col].length; cell++){
            if(linkCheck){
                if(checkerboard[col][cell] === Round){
                    times++;
                    continue;
                }else{
                    linkCheck = false;
                    if(Round === 2){
                        break;
                    }
                }
            }
            if(checkerboard[col][cell] === 2){
                break;
            }else if(checkerboard[col][cell] === 1){
                if(checkerboard[col][cell-1] === 0){
                    computerArray[col][cell-1] += 5; 
                }
            }else{
                computerArray[col][cell] += 1;
            }
        }
        if(times >= winNumber){
            setWin([true,Round])
            return;
        }else if(times > 1){
            for(let cell = 0 ; cell < checkerboard[col].length ; cell++){
                if(checkerboard[col][cell] === 0){
                    computerArray[col][cell] += times*3;
                }
            }
        }
        times = 1;
        linkCheck = true;
        //col確認 向上 向下
        for(let cell = col-1 ; cell >= 0 ; cell--){
            if(linkCheck){
                if(checkerboard[cell][row] === Round){
                    times++;
                    continue;
                }else{
                    linkCheck = false;
                    if(Round === 2){
                        break;
                    }
                }
            }
            if(checkerboard[cell][row] === 2){
                break;
            }else if(checkerboard[cell][row] === 1){
                if(checkerboard[cell+1][row] === 0){
                    computerArray[cell+1][row] += 5;
                }
            }else{
                computerArray[cell][row]++;
            }
        }
        linkCheck =true;
        for(let cell = col +1 ; cell < checkerboard.length ; cell++){
            if(linkCheck){
                if(checkerboard[cell][row] ===Round){
                    times++;
                    continue;
                }else{
                    linkCheck = false;
                    if(Round === 2){
                        break;
                    }
                }
            }
            if(checkerboard[cell][row] === 2){
                break;
            }else if(checkerboard[cell][row] === 1){
                if(checkerboard[cell-1][row] === 0){
                    computerArray[cell-1][row] += 5
                }
            }else{
                computerArray[cell][row] += 1;
            }
        }
        if(times >= winNumber){
            setWin([true,Round])
            return;
        }else if(times > 1){
            for(let cell = 0 ; cell < checkerboard.length ; cell++){
                if(checkerboard[cell][row] === 0){
                    computerArray[cell][row] += times*3;
                }
            }
        }
        times = 1;
        linkCheck = true;
        //斜向 左上 右下
        let cellCol = col-1;
        let cellRow = row-1;
        while(cellCol >= 0 && cellRow >= 0){
            if(linkCheck){
                if(checkerboard[cellCol][cellRow] === Round){
                    times++;
                    cellCol--;
                    cellRow--;
                    continue;
                }else{
                    linkCheck = false;
                    if(Round === 2){
                        break;
                    }
                }
            }
            if(checkerboard[cellCol][cellRow] === 2){
                break;
            }else if(checkerboard[cellCol][cellRow] === 1){
                if(checkerboard[cellCol+1][cellRow+1] === 0){
                    computerArray[cellCol+1][cellRow+1] += 5;
                }
            }else{
                computerArray[cellCol][cellRow] += 2;
            }
            cellCol--;
            cellRow--;
        }
        cellCol = col+1;
        cellRow = row+1;
        linkCheck = true;
        while(cellCol < checkerboard.length && cellRow < checkerboard[col].length){
            if(linkCheck){
                if(checkerboard[cellCol][cellRow] === Round){
                    times++;
                    cellCol++;
                    cellRow++;
                    continue;
                }else{
                    linkCheck = false;
                    if(Round === 2){
                        break;
                    }
                }
            }
            if(checkerboard[cellCol][cellRow] === 2){
                break;
            }else if(checkerboard[cellCol][cellRow] === 1){
                if(checkerboard[cellCol-1][cellRow-1] === 0){
                    computerArray[cellCol-1][cellRow-1] += 5;
                }
            }else{
                computerArray[cellCol][cellRow] += 2
            }
            cellCol++;
            cellRow++;
        }
        if(times >= winNumber){
            setWin([true,Round])
            return;
        }else if(times > 1){
            cellCol = col-1;
            cellRow = row-1;
            while(cellCol >= 0 && cellRow >= 0){
                if(checkerboard[cellCol][cellRow] === 0){
                    computerArray[cellCol][cellRow] +=times * 3;
                }
                cellCol --;
                cellRow --;
            }
            cellCol = col+1;
            cellRow = row+1;
            while(cellCol < limit && cellRow < limit){
                if(checkerboard[cellCol][cellRow] === 0){
                    computerArray[cellCol][cellRow] +=times * 3;
                }
                cellCol++;
                cellRow++;
            }
        }
        times = 1;
        linkCheck = true;
        //斜向 右上 左下
        cellCol = col-1;
        cellRow = row+1;
        while(cellCol >= 0 && cellRow < checkerboard[row].length){
            if(linkCheck){
                if(checkerboard[cellCol][cellRow] === Round){
                    times++;
                    cellCol--;
                    cellRow++;
                    continue;
                }else{
                    linkCheck = false;
                    if(Round === 2){
                        break;
                    }
                }
            }
            if(checkerboard[cellCol][cellRow] === 2){
                break;
            }else if(checkerboard[cellCol][cellRow] === 1){
                if(checkerboard[cellCol+1][cellRow-1] === 0){
                    computerArray[cellCol+1][cellRow-1] += 5
                }
            }else{
                computerArray[cellCol][cellRow] +=2
            }
            cellCol--;
            cellRow++;
        }
        cellCol = col+1;
        cellRow = row-1;
        linkCheck = true;
        while(cellCol < checkerboard.length && cellRow >= 0){
            if(linkCheck){
                if(checkerboard[cellCol][cellRow] === Round){
                    times++;
                    cellCol++;
                    cellRow--;
                    continue;
                }else{
                    linkCheck = false;
                    if(Round === 2){
                        break;
                    }
                }
            }
            if(checkerboard[cellCol][cellRow] === 2){
                break;
            }else if(checkerboard[cellCol][cellRow] === 1){
                if(checkerboard[cellCol-1][cellRow+1] === 0){
                    computerArray[cellCol-1][cellRow+1] += 5;
                }
            }else{
                computerArray[cellCol][cellRow] += 2
            }
            cellCol++;
            cellRow--;
        }
        if(times >= winNumber){
            setWin([true,Round])
            return;
        }else if (times > 1){
            cellCol = col -1;
            cellRow = row +1;
            while(cellCol >= 0 && cellRow < limit){
                if(checkerboard[cellCol][cellRow] === 0){
                    computerArray[cellCol][cellRow] += times*3;
                }
                cellCol--;
                cellRow++
            }
            cellCol = col +1;
            cellRow = row -1;
            while(cellCol < limit && cellRow >= 0){
                if(checkerboard[cellCol][cellRow] === 0){
                    computerArray[cellCol][cellRow] += times*3;
                }
                cellCol++;
                cellRow--;
            }
        }
        //將下棋點移除
        computerArray[col][row] = 0;

        setComputer(computerArray);

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
    //改變模式 重製棋盤
    useEffect(()=>{
        reStart();
    },[limit,winNumber,gameMod])

    //勝利所需的選擇器
    const WinNumberSelect = () =>{
        const option = [];
        for(let i = 3 ; i <= limit ;i++){
            option.push(<option key={i} value={i}>{i}</option>)
        }
        return (
            <select defaultValue={winNumber} onChange={(e)=>{
                const number = parseInt(e.target.value)
                setWinNumber(number)
            }}>
                {option}
            </select>
        )
    }

    //感應切換回合 電腦模式將自動下X 
    useEffect(()=>{
        if(gameMod && newRound === 2){
            let max = 0;
            let ArrayList:[number,number][] = [];
            computer.forEach((index,colKey)=>{
                index.forEach((value,rowKey)=>{
                    if (value > max){
                        max = value;
                        ArrayList = [[colKey,rowKey]];
                    }else if( value === max){
                        ArrayList.push([colKey,rowKey]);
                    }
                })
            })
            if(roundNumber[0] !== roundNumber[1] && win[0] === false){
                let number = 0;
                if(ArrayList.length > 1){
                    number = Math.floor(Math.random() * ArrayList.length) ;
                    // 防止錯誤
                    if(number >= ArrayList.length){
                        number = ArrayList.length -1;
                    }
                }
                // console.log(computer)
                ClickDiv(ArrayList[number][0],ArrayList[number][1])
            }
        }
    },[newRound])

    // 確認電腦判斷陣列
    // useEffect(()=>{
    //     console.log(computer)
    // },[gameMod,computer])

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
                        const number = parseInt(e.target.value);
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
                <div>
                    <label>是否開啟電腦模式</label>
                    <select defaultValue={gameMod === true? "true":"false"} onChange={(e)=>{
                        const index = e.target.value;
                        if(index === "true"){
                            setGameMode(true)
                        }else{
                            setGameMode(false)
                        }
                    }}>
                        <option value="true">開啟</option>
                        <option value="false">關閉</option>
                    </select>
                </div>
            </div>
        </div>
    )
}