import { useEffect,useRef} from "react"
import { useDispatch,useSelector, useStore } from 'react-redux';
import {newGame,swap,setTimerOn,setTime} from './puzzleSlice';

import './puzzle.css'

const Puzzle=(props)=>{
    document.title='Slide Puzzle';
    const puzzle=useSelector(state =>state.puzzle);

    const store=useStore();

    const disPatch= useDispatch();
    
    const addSec=useRef();
    
    const timer=()=>{
        addSec.current= setInterval(()=>{
            let {solved}=store.getState().puzzle;
            if(solved){
                return clearInterval(addSec.current);
            }
            let {seconds}=store.getState().puzzle.timer;
            let hr=Math.floor(seconds/3600);
            let min=Math.floor((seconds-(hr*3600))/60);
            let sec=(seconds-(hr*3600))-min*60;
            if(hr<10){hr=`0${hr}`}
            if(min<10){min=`0${min}`}
            if(sec<10){sec=`0${sec}`}
            let time=`${hr}:${min}:${sec}`;
            disPatch(setTime(time));
        },1000);
    }

    const canSwap=(icol,irow)=>{
        if(puzzle.solved){return}
        let emptyItem=puzzle.items.find(({empty})=>empty===true)
        let gapRow=Math.abs(irow-emptyItem.trades.row);
        let gapCol=Math.abs(icol-emptyItem.trades.col);
        
        if((irow===emptyItem.trades.row&&gapCol===1)||(icol===emptyItem.trades.col&&gapRow===1)){
            let emptyIndex=puzzle.items.findIndex(({empty})=>empty===true);
            let itemIndex=puzzle.items.findIndex(({trades})=>trades.row===irow&&trades.col===icol);
            disPatch(swap([emptyIndex,itemIndex]))

            if(!puzzle.timer.timerOn){
                timer();
                disPatch(setTimerOn(true));
            }
        }
        
    }

    useEffect(()=>{
        disPatch(newGame());
        return ()=>{clearInterval(addSec.current)}
    },[])
    return(
        <div className="puzzle">
            <div className="tags-container">
                <div className="tags">
                    <h4>Timer</h4>
                    <h5>{puzzle.timer.time}</h5>
                </div>
                <div className="tags">
                    <h4>Moves</h4>
                    <h5>{puzzle.moves}</h5>
                </div>
            </div>
            <div className="square-container">
                {puzzle.solved&&<SolvedView start={newGame}/>}
                    {puzzle.items.map((item,index)=>{
                        return<div className={item.empty?'empty-square':'square'} key={item.id}  style={item.trades.style} onClick={()=>{canSwap(item.trades.col,item.trades.row)}}>{!item.empty&&index+1}</div>    
                        })}         
            </div>
        </div>
        
    )
}

const SolvedView=({start})=>{
    const disPatch= useDispatch();
    return(
        <div className="puzzle-solved">
            <h5>Solved !</h5>
            <button onClick={()=>{disPatch(start())}}>Play again</button>
        </div>
    )
}

export default Puzzle