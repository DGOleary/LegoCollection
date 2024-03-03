import {useCallback, useEffect, useState} from 'react';

import './App.css';

function App() {
  const [searchVal, setSearchVal] = useState("");
  const [setNum, setSetNum] = useState("");
  const [setName, setSetName] = useState("");
  const [setCount, setSetCount] = useState(0);
  const [setComplete, setSetComplete] = useState(false);
  const [setNotes, setSetNotes] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [setList, setSetList] = useState({});

  //url of the localhost server
  const serverUrl = "https://localhost:7024/api/LegoCollection/";

  //handles the input to a text box and takes in the set function for the value that is updated
  const handleTextInput = (event, setFunc) => {
    setFunc(event.target.value);
    console.log(setName);
  }

  //handles the complete checkbox
  const handleComplete = () =>{
    setSetComplete(!setComplete);
  }

  //gets a users sets from the database and adds them to the list
  const setUserSets = (setData) =>{
     setSetList(prevState => ({
      ...prevState,
      [setData.set_num]:setData, 
     }))
  }

  //gets search data from a url
  const search = async (url) =>{
    var ret = await fetch(url,{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }});
          return await ret.json();
    }

    //handles pages of searches and puts them in the dropdown
    const getSearches = async () =>{
      let searchEntry = searchVal;
      let data= await search(serverUrl+"SearchSet/"+searchEntry);
      console.log(data);

    }

    //gets a users sets from the database
    const getSets = async () =>{
      let user = "1";
      let results = await fetch(serverUrl+"GetSets",{
        method: "GET",
        headers:{
          "Content-Type": "application/json",
          "UserID": user
        }
      }).then(response => {
        return response.json();
      }).then(json =>{
        for(let key in json){
          setUserSets(json[key]);
        }
      });
    }


//posts the set to the database
const setEnter = () =>{
  let num = setNum;
  let user = "1";
  let set = {
      set_num: num,
      set_name: "",
      set_count: 0,
      set_complete: false,
      set_notes: "",
      set_user_id: user,
      nfc_id: ""
  }
  console.log(JSON.stringify(set));
  fetch(serverUrl+"UploadSet",{
      method: "POST",
      body:JSON.stringify(set),
      headers:{
          "Content-Type": "application/json"
      }}).then(response => {
          console.log(response.status);
      });
}

  return (
    <div className="App">
      <div className="inputs">
      <input type="text" value={searchVal} onChange={(event) => handleTextInput(event,setSearchVal)}></input>
      <button onClick={getSearches}>Enter Search</button>
      <input type="text" value={setNum} onChange={(event) => handleTextInput(event,setSetNum)}></input>
      <input type="text" value={setName} onChange={(event) => handleTextInput(event,setSetName)}></input>
      <input type="number" value={setCount} onChange={(event) => handleTextInput(event,setSetCount)}></input>
      <input type="checkbox" value={setName} onChange={handleComplete}></input>
      <input type="textarea" value={setNotes} onChange={(event) => handleTextInput(event,setSetNotes)}></input>
      <button onClick={setEnter}>Add Set</button>
      <button onClick={getSets}>Get Sets</button>
      </div>
      {Object.keys(setList).length >0 && (<table className="resultsTable">
        <thead>
          <tr>
            <th>Set Name</th>
            <th>Set Number</th>
            <th>Set Count</th>
            <th>Set Completion Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
      {Object.entries(setList).map(([setNum, item])=> (
        <tr key={setNum}>
          <td>{item.set_name} </td>
          <td>{setNum} </td>
          <td>{item.set_count} </td>
          <td>{item.set_complete} </td>
          <td>{item.set_notes}</td>
        </tr>
      ))}
      </tbody>
    </table>)}

    {showDropdown && (
      <div className="searchDropdown">
        
      </div>
    )}
    </div>
  );
}

export default App;
