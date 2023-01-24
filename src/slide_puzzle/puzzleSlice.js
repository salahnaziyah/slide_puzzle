import { createSlice} from "@reduxjs/toolkit";

export const puzzleSlice=createSlice({
    name:'puzzle',
    initialState:{
        items:[],
        moves:0,
        timer:{
            seconds:1,
            time:'00:00:00',
            timerOn:false,

        },
        solved:false,
    },
    reducers:{
        newGame:(state)=>{
            state.moves=0;
            state.timer.seconds=1;
            state.solved=false;
            state.timer.timerOn=false;
            state.timer.time='00:00:00';
            let items=[];
            let top=0;
            let left=0;
            let counter=0;
    
            for(let i=0;i<3;i++){
                for(let j=0;j<3;j++){
                    let item={
                        id:String(Math.random()),
                        trades:{
                            index:counter,
                            style:{
                                top:`${top}px`,
                                left:`${left}px`,
                            },
                            col:j,
                            row:i,
                        },
                        empty:false,
                    };
                    left+=80;
                    items.push(item);
                    counter++;
                }
                top+=80;
                left=0; 
            }
            let lastItem=items.pop();
            items.sort(()=>Math.random()-0.5);
            lastItem={...lastItem,empty:true};
            items.push(lastItem);
            state.items=items;
        },

        setTime:(state,action)=>{
            state.timer.time=action.payload;
            state.timer.seconds+=1;
        },
        

        setTimerOn:(state,action)=>{
            state.timer.timerOn=action.payload;
        },
        

        swap:(state,action)=>{
            state.moves+=1;
            let [item1,item2]=action.payload;
            [state.items[item1].trades,state.items[item2].trades]=[state.items[item2].trades,state.items[item1].trades];
            let points=0;
            state.items.forEach((item,index)=>{
                if(item.trades.index===index){
                    points++;
                }
            });

            if(points===9){
                state.solved=true;
                state.items[state.items.length-1].empty=false;
            }                    
        },

    }

})


export const {newGame,swap,setTimerOn,setTime}=puzzleSlice.actions;
export default puzzleSlice.reducer;