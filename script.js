let trackHabitBox = document.querySelector(".trackHabit-box");
let taskContainer = document.querySelector(".task-container");
let taskList = taskContainer.querySelectorAll(".task-boxes");
let inputBox = document.querySelector(".InputTaskBox");
let taskInput = inputBox.querySelector(".task-input");
let tooLongMsg = inputBox.querySelector("#tooLongMsg");
let hoursInput = inputBox.querySelector(".taskTime-input");
let descInput = inputBox.querySelector(".taskDesc-input");
let descLongMsg = inputBox.querySelector("#execeedingWordsMsg");
let doneBtn = inputBox.querySelector(".DoneBtn");
let addDescBtn = inputBox.querySelector(".AddDescription");
let closeBtn = inputBox.querySelector(".fa-circle-xmark");
let addTaskBtn = document.querySelector(".addBtn");

let date = new Date();
let febdays = date.getFullYear() % 4 === 0 ?  29 : 28; // Check for leap year
const monthNames = [
  {name:"January",days:31}, {name:"February",days:febdays}, {name:"March",days:31}, {name:"April",days:30}, {name:"May",days:31}, {name:"June",days:30},
  {name:"July",days:31}, {name:"August",days:31}, {name:"September",days:30}, {name:"October",days:31}, {name:"November",days:30}, {name:"December",days:31}
];
let NoTasks = 1;
// Check if NoTasks is already in localStorage
if(localStorage.getItem(`${new Date().getDate()}${monthNames[new Date().getMonth()].name}NoTasks`)){
    NoTasks = JSON.parse(localStorage.getItem(`${new Date().getDate()}${monthNames[new Date().getMonth()].name}NoTasks`))
}
else{
    NoTasks = 1;
}

// Create habit box for the current month
const createHabitBox = (month,mode) => {
    let monthNumber = month;
    if(mode === "next")  monthNumber = month + 1;
    if(mode === "prev") monthNumber = month - 1;
    if(monthNumber < 0) monthNumber = 11; // Wrap around to December
    if(monthNumber > 11) monthNumber = 0; // Wrap around to January
    trackHabitBox.innerHTML = "";
    let habitTrack = document.createElement("div");
    let monthDiv = document.createElement("div");
    let dayBox = document.createElement("div");
    let h2 = document.createElement("h2");
    let i1 = document.createElement("i");
    i1.className = "fa-solid fa-chevron-left";
    let i2 = document.createElement("i");
    i2.className = "fa-solid fa-chevron-right";
    i2.setAttribute("onclick", "next()");
    i1.setAttribute("onclick", "prev()");
    dayBox.className = "days";
    monthDiv.className = "month-name";
    habitTrack.className = "trackHabit flex-center";
    habitTrack.id = "habit";
    h2.innerText = monthNames[monthNumber].name;
    monthDiv.appendChild(h2);
    habitTrack.appendChild(monthDiv);
    habitTrack.appendChild(dayBox);
    trackHabitBox.appendChild(i1);
    trackHabitBox.appendChild(habitTrack);
    trackHabitBox.appendChild(i2);
    for(let i = 1;i<= monthNames[monthNumber].days;i++){
        let span = document.createElement("span");
        span.className = "small-boxes";
        dayBox.appendChild(span);
    }
}
let currentMonth = new Date().getMonth();
createHabitBox(currentMonth);

// tracking 
const track = (date,month)=>{
    let TaskArray = Array.from(taskContainer.querySelectorAll(".task-boxes")).filter(task => task.querySelector(".date").innerText == date && task.querySelector(".month").innerText == month);
    let target  = trackHabitBox.querySelector("#habit").querySelector(".days").querySelectorAll("span")[date - 1];
    if(TaskArray.length > 0 && TaskArray.length <= 2){
        target.style.backgroundColor = "#216e39";
    }
    if(TaskArray.length >=3 && TaskArray.length <= 4){
        target.style.backgroundColor = "rgb(38, 159, 38)";
    }
    if(TaskArray.length >= 5 && TaskArray.length < 6){
        target.style.backgroundColor = "#40c463";   
    }
    if(TaskArray.length >= 6){
        target.style.backgroundColor = "rgb(0, 255, 0)";
    }
}

let next =  () => {
    let NameOfMonth = trackHabitBox.querySelector(".month-name").querySelector("h2").innerText;
    let month = monthNames.findIndex(m => m.name === NameOfMonth);
    createHabitBox(month,"next");
    taskContainer.innerHTML = "";
     if(month === 11) month = -1; // Wrap around to December
    getTaskFromLocalStorage(monthNames[month + 1].name);
}
let prev = () => {
    let NameOfMonth = trackHabitBox.querySelector(".month-name").querySelector("h2").innerText;
    let month = monthNames.findIndex(month => month.name === NameOfMonth);
    createHabitBox(month,"prev");
    taskContainer.innerHTML = "";
     if(month === 0) month = 12; // Wrap around to December
    getTaskFromLocalStorage(monthNames[month - 1].name);
}

const DisplayDesc = (box) => {
    let desc = box.querySelector(".task-desc");
                if( desc.style.display === "block"){
                    desc.style.display = "none"
                    box.querySelector(".vertical-span").style.width = "50px";
                    box.querySelector(".vertical-span").style.marginTop = "30px";
                    box.style.marginBottom = "0px";
                }
                else{
                    desc.style.display = "block";
                    box.querySelector(".vertical-span").style.width = "60px";
                    box.querySelector(".vertical-span").style.marginTop = "35px";
                    box.style.marginBottom = "20px";
                }
}
if(taskList.length){
    taskList.forEach(box =>{
        box.querySelector(".task").removeEventListener("click",DisplayDesc)
        box.querySelector(".task").addEventListener("click", () => {
            if(box.querySelector(".task-desc")){
                DisplayDesc(box);
            } 
        });
})
}

// Adding tasks
const createDateBox = (currentDate,currentMonth)=>{
    let dateBox = document.createElement("div");
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let span = document.createElement("span");
    p1.innerText = currentDate;
    p2.innerText = currentMonth;
    p1.className = "date";
    p2.className = "month";
    span.className = "horizontal-span";
    dateBox.className = "date-box flex-center";
    dateBox.appendChild(p1);
    dateBox.appendChild(p2);
    dateBox.appendChild(span);
    return dateBox;
}
const createTaskBox = (name,hours,desc,date,month)=>{
    let taskBox = document.createElement("div");
    taskBox.appendChild(createDateBox(date,month));
    let span = document.createElement("span");
    let h3  = document.createElement("h3");
    h3.innerText = name
    h3.className = "task"
    span.className = "vertical-span";
    taskBox.className = "task-boxes";
    let p2 = document.createElement("p");
    p2.innerText = hours;
    p2.className = "hours";
    taskBox.appendChild(span);
    taskBox.appendChild(h3);
    if(desc != ""){
        let p1 = document.createElement("p");
        p1.innerText = desc;
        p1.className = "task-desc"
        taskBox.appendChild(p1);
    }
    taskBox.appendChild(p2);
    if(taskBox.querySelector(".task-desc")) taskBox.setAttribute("onclick","DisplayDesc(this)");
    taskContainer.prepend(taskBox);
}

// taking inputs
addTaskBtn.addEventListener("click",()=>{
    if(inputBox.style.display === "flex"){
        inputBox.style.display = "none";
        taskContainer.style.display = "block";
        trackHabitBox.style.display = "flex";
        document.querySelector("main").querySelector("h4").style.display = "block";
    }
    else{
        inputBox.style.display = "flex";
        taskInput.value = "";
        hoursInput.value = "";
        descInput.value = "";
        descInput.style.display = "none";
        inputBox.style.height = "240px";
        inputBox.style.bottom = "30%";
        taskContainer.style.display = "none";
        trackHabitBox.style.display = "none";
        document.querySelector("main").querySelector("h4").style.display = "none";

    }
})
const DisplayInputDescBox = ()=>{
if(descInput.style.display === "block"){
        descInput.style.display = "none";
        inputBox.style.height = "240px";
        inputBox.style.bottom = "30%";
        descInput.value = "";
    }
    else{
        descInput.style.display = "block";
        inputBox.style.height = "320px";
        inputBox.style.bottom = "22%";
    }
}
addDescBtn.addEventListener("click",()=>{
    DisplayInputDescBox();
});
taskInput.addEventListener("input",()=>{
    if(taskInput.value.length > 35){
        tooLongMsg.style.visibility = "visible";
    }
    else{
        tooLongMsg.style.visibility = "hidden";
    }
})
descInput.addEventListener("input",()=>{
    if(descInput.value.trim().length > 60){
        descLongMsg.style.visibility = "visible";
    }
    else{
        descLongMsg.style.visibility = "hidden";
    }
})
const checkInput = () =>{
    let taskName = taskInput.value.trim();
    let hours = hoursInput.value.trim();
    let desc = descInput.value.trim();
    if(taskName.length > 35){
        tooLongMsg.style.visibility = "visible";
        return;
    }
    if(desc.length > 60){
        descLongMsg.style.visibility = "visible";
        return;
    }
    if(taskName === "" || hours === ""){
        alert("Please fill all the fields");
        return
    }
    let date = new Date();
    let currentDate = date.getDate();// 2
    let currentMonth = monthNames[date.getMonth()].name;
    if( trackHabitBox.querySelector(".month-name").querySelector("h2").innerText != currentMonth){
        createHabitBox(date.getMonth());
        getTaskFromLocalStorage(monthNames[date.getMonth()].name);
    }
    createTaskBox(taskName, hours, desc,currentDate,currentMonth);  
    track(currentDate,currentMonth);
    localStorage.setItem(currentDate+currentMonth+`tsk${NoTasks}`,JSON.stringify({name:taskName,hours:hours,desc:desc,date:currentDate,month:currentMonth}));
    NoTasks++;
    localStorage.setItem(`${currentDate}${currentMonth}NoTasks`, NoTasks);
    inputBox.style.display = "none";
    taskContainer.style.display = "block";
    trackHabitBox.style.display = "flex";
    document.querySelector("main").querySelector("h4").style.display = "block";
}


doneBtn.addEventListener("click",()=>{
   checkInput();
});
closeBtn.addEventListener("click",()=>{
        inputBox.style.display = "none";
        taskContainer.style.display = "block";
        trackHabitBox.style.display = "flex";
        document.querySelector("main").querySelector("h4").style.display = "block";
});

const getTaskFromLocalStorage = (month) => {
     let array = [];
     let valueArray = [];
    for(let i = 0; i < localStorage.length; i++){
        array.push(localStorage.key(i));
    }
    let array2 = array.filter(key => key.includes(month+`tsk`));
    if(array2.length === 0){
        taskContainer.innerHTML = `<h4 class="no-tasks">No tasks for this month</h4>`;
        return;
    }
    for(let i = 0;i<array2.length;i++){
        let value = JSON.parse(localStorage.getItem(array2[i]));
        valueArray.push(value);
    }
    valueArray.sort((a,b)=> {
    if(a.date < b.date) return -1;});
    for(let i = 0;i<valueArray.length;i++){
        let value = valueArray[i];
        createTaskBox(value.name, value.hours, value.desc, value.date, value.month);
        track(value.date, value.month);
    }
}
if(localStorage.length){
   getTaskFromLocalStorage(monthNames[date.getMonth()].name);
}

//  custom scroll bar 
const visibleScrollThumb = ()=>{
    taskContainer.style.setProperty("--scroll-display", `block`);
    setTimeout(() => {
        taskContainer.style.setProperty("--scroll-display", `none`);
    }, 1000);
}
taskContainer.addEventListener("scroll", visibleScrollThumb);

let b = trackHabitBox.querySelector("#habit").querySelector(".days").querySelectorAll("span");
b.forEach((box, index) => {
    box.addEventListener("click", () => {
        let date = index + 1;
        let month = trackHabitBox.querySelector(".month-name").querySelector("h2").innerText;
        let taskNo = JSON.parse(localStorage.getItem(`${date}${month}NoTasks`)) - 1;
        if(taskNo < 0) {
            taskNo = "0";
        }
        let tag = document.createElement("div");
        tag.innerText = `${taskNo} activity`;
        tag.style.top = "50%";
        tag.style.left = "50%";
        tag.className = "task-tag"
        box.appendChild(tag);

    });
});