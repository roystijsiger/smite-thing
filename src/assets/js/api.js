import axios from 'axios';
let md5 = require('md5');
let developerId = process.env.DEVELOPER_ID;
let authorizationKey = process.env.AUTHORIZATION;
let responseFormat = process.env.RESPONSE_FORMAT;
let languageCode =process.env.LANGUAGE_CODE;
let session;

let ai = axios.create();
//{
//   baseURL: "http://api.smitegame.com/smiteapi.svc/"
// }




export async function Ping(){
  await ai.get(`/api/pingJson`).then(response => {
    console.log(`response`, response.data);
  })
}

export  async function CreateSession(){
  //set basic are we allowed to make a new session?
  let allowedToCreateNewSession = false;
  let timestamp = getTimestamp();

  //if session is already set we need to check the time
  if(localStorage.getItem('session')){
    let signature = getSignature("testsession");

    //testsession[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}
    await ai.get(`api/testsession${responseFormat}/${developerId}/${signature}/${localStorage.getItem('session')}/${timestamp}`).then(function(response){

      //console log response
      console.log(`testsession:`, response.data);

      //if the response start with "In" its most like gonna spell invalid :(
      if(response.data[0] == "I" && response.data[1] == "n"){
        allowedToCreateNewSession = true;
      }


      if(allowedToCreateNewSession) {
        getSession(timestamp);
      }

    })
  }
  else{
    getSession(timestamp);
  }
}

export async function GetItems(){
  //getitems[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{languagecode}
  let signature = getSignature("getitems");
  let timestamp = getTimestamp();
  return await ai.get(`api/getitems${responseFormat}/${developerId}/${signature}/${localStorage.getItem('session')}/${timestamp}/${languageCode}`);
}

async function getSession(timestamp){
  //create new signature
  let signature = getSignature("createsession");

  ///createsession[ResponseFormat]/{developerId}/{signature}/{timestamp}
  await ai.get(`api/createsession${responseFormat}/${developerId}/${signature}/${timestamp}`).then(function(response){
    console.log(`response`, response.data);
    localStorage.setItem('session', response.data.session_id);
  })
}

function getSignature(method){
  let timestamp = getTimestamp();
  return md5(`${developerId + method + authorizationKey + timestamp}`);
}

function getLeadingZeros(number){
  if(Number(number) <= 9){
    return "0" + number;
  }
  return number;
}

function getTimestamp(){
  var date = new Date();
  var timestamp = "" + date.getUTCFullYear()
    + getLeadingZeros((date.getUTCMonth() + 1))
    + getLeadingZeros(date.getUTCDate())
    + getLeadingZeros(date.getUTCHours())
    + getLeadingZeros(date.getUTCMinutes())
    + getLeadingZeros(date.getUTCSeconds());

  console.log(`timestamp`, timestamp);
  return timestamp;
}


