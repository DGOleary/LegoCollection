const serverUrl = "https://localhost:7024/api/LegoCollection/";

window.onload = () => {
    document.getElementById("searchEnter").onclick = search;
    document.getElementById("setEnter").onclick = setEnter;
}

const search = () =>{
    let searchEntry = document.getElementById("searchEntry").value;

    fetch(serverUrl+"SearchSet/"+searchEntry,{
        method: "GET",
        headers:{
            "Content-Type": "application/json"
        }}).then(response => {
            return response.json();
        }).then(json => {
            console.log(json);
        });
}

const setEnter = () =>{
    let num = document.getElementById("setNumber").value;
    let user="1";
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