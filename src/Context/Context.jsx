import { createContext, useState } from "react";
import run from '../Config/Api'
export const Context = createContext();

const ContextProvider = (props)=>{
    const [input,setInput] = useState('') // to save the input data
    const [recentPrompt,setRecentPrompt] = useState('') // input field data will be saved on recent prompt
    const [prevPrompts,setPrevPrompts] = useState([]) // use to store all input history
    const [showResults,setshowResults] = useState(false) // cards ko hide krdega and display the result
    const [loading,setLoading] = useState(false); //jb load hoga data tb display krenge nhi toh fr false krdenge
    const [resultData,setResultData] = useState("") // to display result on web page

    const delayPara = (index,nextWord)=>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord)
        },75*index)
    }
    const onSent = async (prompt)=>{
        setResultData("")
        setLoading(true)
        setshowResults(true)
        let response1;
        if(prompt !== undefined){
            response1 = await run(prompt)
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response1 = await run(input)
        }
       // const response = await run(input)
        let newArray = response1.split("**")
        let newResponse = "";
        for(let i=0; i<newArray.length; i++){
            if(i===0 || i%2!==1){
                newResponse += newArray[i];
            }
            else{
                newResponse += '<b>'+newArray[i]+'</b>'
            }
        }
        let newResponse2 = newResponse.split("*").join("<br/>")
        let newResponseArray = newResponse2.split(" ")
        for(let i=0; i<newResponseArray.length; i++){
            const nextWord = newResponseArray[i]
            delayPara(i,nextWord+" ")
        }
        //setResultData(newResponse2)
        setLoading(false)
        setInput("")
    }
    //onSent("What is React js")
    const contextValue ={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        loading,
        resultData,
        showResults,
        input,
        setInput,
    }
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider

