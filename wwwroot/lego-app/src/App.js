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
  const [isChecked, setChecked] = useState(false);
  //keeps track of what page the search is on
  let page=1;


  //url of the localhost server
  const serverUrl = "https://localhost:7024/api/LegoCollection/";

  //handles the input to a text box and takes in the set function for the value that is updated
  const handleTextInput = (event, setFunc) => {
    setFunc(event.target.value);
  }

  //handles the complete checkbox
  const handleComplete = () =>{
    setChecked(!isChecked);
    setSetComplete(!setComplete);
  }

  //gets a users sets from the database and adds them to the list
  const setUserSets = (setData) =>{
     setSetList(prevState => ({
      ...prevState,
      [setData.set_num]:setData, 
     }));
  }

  //gets a users sets from the database and adds them to the list
  const setSearchResults = (searchData) =>{
    setSearchList(prevState =>[...prevState, ...searchData]);
 }

 const enterSearchResult = (result) =>{
  setSetNum(result.set_num);
  setSetName(result.name);
  setShowDropdown(false);
 }

  //adds search results to list
  const addSearchResults = (data) => {
    setSearchResults(data);
  }

  useEffect(() =>{
    document.addEventListener("click", () => {
      setShowDropdown(false);
    });
  },[]);

  //gets search data from a url
  const search = async (url) =>{
    let ret = await fetch(url,{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }}).then(response => {
          return response.json();
        }).then(data => {
          addSearchResults(data["results"]);
          if(data["next"]!=null){
            page++;
            //TODO fix this later so the server accepts it better
            search(serverUrl+"SearchSet/%3Fpage%3D"+page+"&search%3D"+searchVal);
          }
        });
    }

    //handles pages of searches and puts them in the dropdown
    const getSearches = async () =>{
      //reset list to empty when performing a new search
      setSearchList([]);
      page=1;
      await search(serverUrl+"SearchSet/%3Fsearch%3D"+searchVal);
      console.log();
      console.log("Final list:");
      console.log(searchList);
      console.log();
      setShowDropdown(true);
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
          console.log(json[key])
          setUserSets(json[key]);
        }
      });
    }

//posts the set to the database
const setEnter = () =>{
  let user = "1";
  let set = {
      set_num: setNum,
      set_name: setName,
      set_count: setCount,
      set_complete: setComplete,
      set_notes: setNotes,
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
          setSetNum("");
          setSetComplete(false);
          setChecked(false);
          setSetCount(0);
          setSetNotes("");
          setSetName("");
      });
}

  return (
    <div className="App">
      <div className="inputs">
      <input type="text" value={searchVal} onChange={(event) => handleTextInput(event,setSearchVal)}></input>
      <button onClick={getSearches}>Enter Search</button>
      {showDropdown && (
      <div className="searchDropdown">
        {searchList.map((result, index) =>
        <div key={index} onClick={() => enterSearchResult(result)}>{result.name}</div>
        )}
      </div>
    )}
      Set Number:
      <input type="text" value={setNum} onChange={(event) => handleTextInput(event,setSetNum)}></input>
      Set Name:
      <input type="text" value={setName} onChange={(event) => handleTextInput(event,setSetName)}></input>
      How many copies?
      <input type="number" value={setCount} onChange={(event) => handleTextInput(event,setSetCount)}></input>
      Is it complete?
      <input type="checkbox" value={setName} checked={isChecked} onChange={handleComplete}></input>
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
          <td>{item.set_complete.toString()} </td>
          <td>{item.set_notes}</td>
        </tr>
      ))}
      </tbody>
    </table>)}
    </div>
  );
}

export default App;
