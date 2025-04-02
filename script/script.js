if('serviceWorker' in navigator){
  navigator.serviceWorker.register("./service-worker.js").then(
    (registration) => {
      console.log("Service worker registration succeeded:", registration);
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    },
  );
}

let listOfStations=[];
let radioServer='';
const countryFlag=document.getElementsByClassName('countryFlag');
const radioStations=document.getElementById('radioListItems');
const sidebar=document.getElementById('sidebar');
const renderSidebar=(country)=>{
  sidebar.innerHTML=`
  <div class="currentCountryDetails">
        <div class="currentSelectedCountry">
            <span class="countryName">${country.name}</span> 
            <img class="countryFlag"  onerror="this.onerror=null; this.src='././assets/logo.png';" alt="Image" style="height: 32px;">
        </div>
        <div class="currentSelectedCountryRadioCounts">
            <i class="fa-solid fa-radio"></i> 
            <span>${country.stationcount.toLocaleString('en-IN')} stations</span>
        </div>
    </div>

         <div class="list">
        <div class="section-header">
            Discover the World
        </div>
      <div class="searchBar searchCtry">
                <input type="text" oninput="filterCountries(event)" placeholder="Search Country">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
        <div>
            <ul id="countryList">

            </ul>
        </div>
    </div>
`
renderCountryList(countryList)
Array.from(countryFlag).forEach((el)=>{el.src=`https://flagsapi.com/${country.iso_3166_1.toUpperCase()}/flat/32.png`;el.title=`${country.name}`})
}

const renderCountryList=(countries)=>{
  const countrySelectDropdown=document.getElementById('countryList');
  countrySelectDropdown.innerHTML= countries?.length>0?countries.map((country)=>{
  return `
  <li onclick="fetchStationList('${country.iso_3166_1}')">${country.name}</li>
  `
  }).join(""):'<li>No Country Found</li>';
}

const filterCountries=(event)=>{
  let filteredList=countryList.filter(country=>country.name.toLowerCase().replace(/\s+/g, '').includes(event.target.value.toLowerCase().replace(/\s+/g, '')));
  renderCountryList(filteredList)
}

const fetchStationList=(countryCode)=>{  
  let countryInFocus=countryList[countryList.findIndex(x=>x.iso_3166_1==countryCode)];
  renderSidebar(countryInFocus)
  sidebar.style.left=window.innerWidth>500?'-30dvw':'-80dvw';
  radioStations.innerHTML=`  <div class="customLoader">
        <div class="loader" style="left:1.5rem"></div>
        <div class="loaderText">Fetching Stations<span class="dots"><span>.</span><span>.</span><span>.</span></div>
    </div>`
  try {
    fetch(`https://${radioServer}/json/stations/bycountrycodeexact/${countryCode}`,{
      method: "POST",
      headers: {
        "Content-Type": `application/x-www-form-urlencoded`
      }
    }).then((res)=>res.json()).then((data)=>{
      document.getElementById('loader').style.display = 'none';
      document.getElementById('mainContent').style.display = 'block';
      renderStations(data);listOfStations=data
    }).catch((error)=>{
      console.error(error);
      document.getElementById('loader').style.display = 'none';
      radioStations.innerHTML=`<div style="width:100%;text-align: center;padding: 2rem;color:red">Failed to fetch Stations. Check network Connection, or try again later.</div>`
    })
    
  } catch (error) {
    console.log(error)
  }
}



// const countrySelectDropdown=document.getElementById('countryList');


const fetchCountryListData=()=>{
  fetch(`https://${radioServer}/json/countries`,{
    method: "GET",
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`
    }
  }).then((res)=>res.json()).then((data)=>{countryList=data;
    let randomCountry='';
    if(countryList?.length>0){
        randomCountry=countryList[Math.floor(Math.random() * countryList?.length)+1];
        renderSidebar(randomCountry);
    }
    fetchStationList(randomCountry.iso_3166_1)}).catch((error)=>{
      Array.from(countryFlag).forEach((el)=>{el.src=`./assets/logo.png`;el.style.height="32px"})
      fetchStationList(null)
    })
}


const fetchRadioServerList=()=>{
  fetch('https://all.api.radio-browser.info/json/servers').then((res)=>res.json()).then((data)=>{
    radioServer=data[Math.floor(Math.random()*(data.length))]?.name;
    console.log('test',radioServer)
    fetchCountryListData();
  });
}
fetchRadioServerList();

let countryList=[]

let userCountry= document.getElementById('countryFlag')
userCountry.addEventListener('click',()=>{
  sidebar.style.left=0;
})

const hideSidebar=(event)=>{
  if (!sidebar.contains(event.target) && !userCountry.contains(event.target)) {
    sidebar.style.left = window.innerWidth>500?'-30dvw':'-80dvw';
}
}

document.addEventListener('click',(event)=>hideSidebar(event))

document.addEventListener('touchstart', (event)=>hideSidebar(event));

// countrySelectDropdown.addEventListener('change',(event)=>{
//   if(event.isTrusted){
//     countryFlag.src=`https://flagsapi.com/${event.target.value.toUpperCase()}/flat/32.png`;
//     fetchStationList(event.target.value)
//   }
// });



const renderStations=(stations)=>{
  const stationHTML = stations?.length>0?stations.map((station,index)=>{
    return `
      <div class="radioListItems" id="radio${index}" onclick="playStation(${index},'${station.name.replace(/['"]/g, '\\$&')}')">
      <div class="stationSerialNo">${index+1}</div>
      <div class="stationInfo" title="${station.name}">
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
  playingStation.innerHTML=`<div style="width:100%;text-align: center;">Fetching Stream<span class="dots"><span>.</span><span>.</span><span>.</span></div>`
  try {
    audio.play().then((data)=>{
      audioPlaying=true;
      mainControl.innerHTML=`<i class="fa-solid fa-pause"></i>`;
      playingStation.innerHTML=`
      <div class="currentStationLogo"><img src="${currentStation?.favicon}" onerror="this.onerror=null; this.src='././assets/logo.png';" alt="Image"></div>
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