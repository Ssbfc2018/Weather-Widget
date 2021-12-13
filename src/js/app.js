const url="https://api.openweathermap.org/data/2.5/";
const imgURL="http://openweathermap.org/img/wn/";
const api_Key="842d632740c85304d9a3cea124817377";
let latitude;
let longitude;

// get current location
function success(position){
    latitude=position.coords.latitude;
    longitude=position.coords.longitude;
    currentWeather();
    future();
}
function error(){
    alert("Unable to retrieve your location");
}

// get today's weather though lat&lon
function currentWeather(){
    getTemp().then((main) => {
        document.getElementsByClassName("temp")[0].innerHTML=Math.round(main.temp)+"℃";
    });
    getWeather().then((weather) => {
        document.getElementsByClassName("current-conditions")[0].getElementsByTagName("img").src=`${imgURL}${weather[0].icon}@2x.png`;
        document.getElementsByClassName("condition")[0].innerHTML=weather[0].description;
    });
}
const getTemp = (query) => {
    return fetch(`${url}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_Key}`)
    .then((response) => response.json())
    .then((data) => data.main);         
}
const getWeather = (query) => {
    return fetch(`${url}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_Key}`)
    .then((response) => response.json())
    .then((data) => data.weather);         
}

// get 5 days/3 hour forecast data
function future(){
    getFuture().then((list) => {
        let week=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        let today=new Date();
        let weekday=today.getDay()+1;
        today=today.getDate()+1;
        let days=0;
        let max=list[0].main.temp;
        let min=list[0].main.temp;
        list.forEach((i) => {
            if(i.dt_txt.substring(8,10) !="12"){
                if(i.dt_txt.substring(8,10) != today){
                    //comes to next day
                    today++;
                    //weekday
                    if(weekday>=7){weekday-=7;}
                    document.getElementsByTagName("h3")[days].innerHTML=week[weekday];
                    //icon
                    document.getElementsByClassName('day')[days].getElementsByTagName("img")[0].src=`${imgURL}${i.weather[0].icon}@2x.png`;
                    //description
                    document.getElementsByClassName('day')[days].getElementsByClassName("description")[0].innerHTML=i.weather[0].description;
                    //max and min temperature
                    document.getElementsByClassName('day')[days].getElementsByClassName("temp")[0].getElementsByClassName('high')[0].innerText=max.toFixed()+"℃";
                    document.getElementsByClassName('day')[days].getElementsByClassName("temp")[0].getElementsByClassName('low')[0].innerText=min.toFixed()+"℃";
                    if(days<4){days++;}
                    weekday++;
                    max=i.main.temp;
                    min=i.main.temp;
                }
                if(i.main.temp>=max){
                    max=i.main.temp;
                }else if(i.main.temp<=min){
                    min=i.main.temp;
                }
                
            }
        });
    })
}
const getFuture = (query) => {
    return fetch (`${url}forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_Key}`)
    .then((response) => response.json())
    .then((data) => data.list);
}

if(!navigator.geolocation){
    alert("Geolocation is not supported by your browser");
}else{
    navigator.geolocation.getCurrentPosition(success,error);
}