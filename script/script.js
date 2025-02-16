if('serviceWorker' in navigator){
  navigator.serviceWorker.register("../manifest/service-worker.js").then(
    (registration) => {
      console.log("Service worker registration succeeded:", registration);
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    },
  );
}

let listOfStations=[];
let url='https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/';
const fetchStationList=(countryCode)=>{
  radioStations.innerHTML='<div style="width:100%;text-align: center;padding: 2rem;">Loading...</div>'
  fetch(url+countryCode,{
    method: "POST",
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`
    }
  }).then((res)=>res.json()).then((data)=>{renderStations(data);listOfStations=data})
}
const countrySelectDropdown=document.getElementById('countryList');
fetch('http://de1.api.radio-browser.info/json/countries',{
  method: "POST",
  headers: {
    "Content-Type": `application/x-www-form-urlencoded`
  }
}).then((res)=>res.json()).then((data)=>{countryList=data;
  let randomCountry='';
  if(countryList?.length>0){
    countrySelectDropdown.innerHTML= countryList.map((country)=>{
      return `
      <option value="${country.iso_3166_1}">${country.name}</option>
      `
    }).join("");
    randomCountry=countryList[Math.floor(Math.random() * countryList?.length)+1]
    countryFlag.src=`https://flagsapi.com/${randomCountry.iso_3166_1.toUpperCase()}/flat/32.png`;
    countryFlag.title=`${randomCountry.name}`;
    countrySelectDropdown.value=`${randomCountry.iso_3166_1}`
  }
  fetchStationList(randomCountry.iso_3166_1)})

let countryList=[]


countrySelectDropdown.addEventListener('change',(event)=>{
  if(event.isTrusted){
    countryFlag.src=`https://flagsapi.com/${event.target.value.toUpperCase()}/flat/32.png`;
    fetchStationList(event.target.value)
  }
});

const radioStations=document.getElementById('radioListItems');

const renderStations=(stations)=>{
  const stationHTML = stations?.length>0?stations.map((station,index)=>{
    return `
      <div class="radioListItems" id="radio${index}" onclick="playStation(${index},'${station.name.replace(/['"]/g, '\\$&')}')">
      <div class="stationSerialNo">${index+1}</div>
      <div class="stationInfo">
      <div class="stationText">
      <span class="stationName">${station.name}</span>
      <span class="stationTags">${station.tags}</span>
      </div>
      </div>
      <div class="stationLanguage">${station.language}</div>
      <div class="stationClicks24Count">${station.clickcount}</div>
      <div class="stationVotes">${station.votes.toLocaleString('en-IN')}</div>
      </div>
    `;
  }).join(""):`<div style="width:100%;text-align: center;padding: 2rem;">No Stations Found</div>`;

  radioStations.innerHTML=stationHTML;
}

// if(listOfStations?.length>0)
// renderStations(listOfStations);

const audio=new Audio();
let currentStation='';
let previousStation='';
let nextStation='';
let audioPlaying=false;

const playStation=(stationIndex,stationName)=>{
  const stationToHighlight=document.getElementById(`radio${stationIndex}`);
  const radio=document.querySelectorAll('.radioListItems');
  radio.forEach((el)=>{
    el.removeAttribute("aria-current");
  })

  if (stationToHighlight) stationToHighlight.setAttribute("aria-current", "true");

  let selectedStation= listOfStations[listOfStations.findIndex(x=>x.name==stationName)];
  audio.src=selectedStation.url_resolved;
  audio.title=selectedStation.name;
  previousStation=currentStation;
  currentStation=selectedStation;
  nextStation=listOfStations[listOfStations.findIndex(x=>x.name==stationName)+1];

  audioPlaying=false;
  mainControl.innerHTML=`<i class="fa-solid fa-play"></i>`;
  playingStation.innerHTML=`<div style="width:100%;text-align: center;">Fetching Stream...</div>`
  try {
    audio.play().then((data)=>{
      audioPlaying=true;
      mainControl.innerHTML=`<i class="fa-solid fa-pause"></i>`;
      playingStation.innerHTML=`
      <div class="currentStationLogo"><img src="${currentStation?.favicon}" onerror="this.onerror=null; this.src='../assets/logo.png';" alt="Image"></div>
      <div class="currentStationDetails">
      <div class="currentStationName">${currentStation?.name}</div>
      <div class="currentStationLanguage">${currentStation?.language}</div>
      </div>
      `
    }).catch((error)=>{
      console.log('checking',error);
      audioPlaying=false;
      mainControl.innerHTML=`<i class="fa-solid fa-play"></i>`;
      playingStation.innerHTML=`<div style="width:100%;text-align: center;color:red">Unable to Play. Play other Station.</div>`
    })
    
  } catch (error) {
    console.log(error)
  }
  
}

const mainControl=document.getElementById('mainControl');
const previousPlay=document.getElementById('previous');
const nextPlay=document.getElementById('next');
const volume= document.getElementById('volume');
const volIcon=document.getElementById('volIcon');
const countryFlag=document.getElementById('countryFlag');


mainControl.addEventListener('click',()=>{
  if(audioPlaying) {mainControl.innerHTML=`<i class="fa-solid fa-play"></i>`;audio.pause();}
  else {mainControl.innerHTML=`<i class="fa-solid fa-pause"></i>`;audio.play()};
  audioPlaying=!audioPlaying;
})

volume.addEventListener('change',(event)=>{
  audio.volume=event.target.value/100;
})
{/* <i class="fa-solid fa-volume-xmark"></i> */}
mute=false;
volIcon.addEventListener('click',()=>{
  mute=!mute;
  audio.muted=mute;
  if(mute){
    volIcon.classList.add('fa-volume-xmark')
  }else{
    volIcon.classList.remove('fa-volume-xmark')  
  }
})

nextPlay.addEventListener('click',()=>{
  audio.pause();
  previousStation=currentStation;
  audio.src=nextStation.url_resolved;
  audio.play();
  playingStation.innerHTML=`
  <div class="currentStationLogo"><img src="${nextStation?.favicon}"></div>
  <div class="currentStationDetails">
  <div class="currentStationName">${nextStation?.name}</div>
  <div class="currentStationLanguage">${nextStation?.language}</div>
  </div>
  `
})

previousPlay.addEventListener('click',()=>{
  audio.pause();
  currentStation=previousStation;
  audio.src=currentStation.url_resolved;
  audio.play();
  playingStation.innerHTML=`
  <div class="currentStationLogo"><img src="${currentStation?.favicon}"></div>
  <div class="currentStationDetails">
  <div class="currentStationName">${currentStation?.name}</div>
  <div class="currentStationLanguage">${currentStation?.language}</div>
  </div>
  `
})



const element = document.querySelector('.radioListHeaders')
const elementOffsetTop = element.offsetTop;
// Add an event listener for the scroll event
window.addEventListener('scroll', function() {
  // Check the scroll position
  if (window.scrollY  > elementOffsetTop) {
    // Add the fixed class
    element.classList.add('fixedHeaders');
  } else {
    // Remove the fixed class
    element.classList.remove('fixedHeaders');
  }
});

const playingStation= document.getElementById('playingStation');
const searchStations=document.getElementById('searchStations');

searchStations.addEventListener('input',(event)=>{
let filteredList=listOfStations.filter(station=>station.name.toLowerCase().replace(/\s+/g, '').includes(event.target.value.toLowerCase().replace(/\s+/g, '')));
renderStations(filteredList)
})