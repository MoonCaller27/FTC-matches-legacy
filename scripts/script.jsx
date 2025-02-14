//FTC Matches
//https://github.com/karsteny/FTC-matches
//Definitely not the best code in the world, but hey, it works.

import { trackedEvent } from './tracker.js';
import { createDivWithClassAndText } from './helpfulHTML.js';
//Always existing elements
const list = document.getElementById("match_list");
const scrollA = document.getElementById("scroll-container-a");
const scrollB = document.getElementById("scroll-container-b");
const counterContainer = document.getElementById("counter-container");

//Actual Variables
let team = window.num;
var tracker;
var teamSchedule;
var allSchedule;
var allResults;
var rankResponse;
var autoRefresh;
//all these functions are async because async properly is genuinely confusing
//the entire program currently assumes that A. the API provides the matches in the order that they would be played B. the schedule api and matches api are in the same order.
//both of these appear to be true

//pre-init: set title
document.title = window.num + " - " + window.evCode;
document.getElementById("team-name").textContent = window.num + " - " + window.teamName;
document.getElementById("meet-details").textContent = window.evName;
//init: make all the elements for the matches, get scores, get ranks, etc etc
async function initialize() {
  //rip
  if (await getData() == false) {
    return;
  }
  const rankPairs = ranksToKeyPairs();
  tracker = new trackedEvent(allSchedule, allResults, "7159", teamSchedule);
  tracker.addElements(scrollA, scrollB);
  tracker.updateRanks(rankPairs);
  //spacing for the infinite scrolling "wraparound"
  const rando = document.createElement("div");
  rando.style.height = "2em";
  scrollA.appendChild(rando);
  statusUpdate();
  console.log(tracker.getNextNum());
  updateScroll();
  autoRefresh = setInterval(() => {
    updateEverything();
  }, 20000);
}

//main refresh
async function updateEverything() {
  if (await getData() == false) {
    return;
  }
  const rankPairs = ranksToKeyPairs();
  //literally just creates the event as new as it would be hard to figure out where the new match is
  if (tracker.isChanged(allSchedule)) {
    console.log("reset");
    scrollA.innerHTML = "";
    scrollB.innerHTML = "";
    tracker = new trackedEvent(allSchedule, allResults, "7159", teamSchedule);
    tracker.addElements(scrollA, scrollB);
    tracker.updateRanks(rankPairs);
    const rando = document.createElement("div");
    rando.style.height = "2em";
    scrollA.appendChild(rando);
    updateScroll();
    statusUpdate();
    console.log("reset complete");
  } else {
    tracker.updateScoresAndStatus(allResults);
    tracker.updateRanks(rankPairs);
    statusUpdate();
  }
}

//makes it so you can feed in team number to array and get out the rank (ex: ranks["7159"]==11)
function ranksToKeyPairs() {
  var resp = {};
  rankResponse.rankings.forEach(element => {
    resp[element.teamNumber.toString()] = element.rank;
  });
  return resp;
}

//gets all of the data at the same time to try and avoid having partially inputted data
//returns false if at least one of the API calls failed.
//lots of the commented out stuff is to replace the live data with fake data for testing
async function getData() {
  teamSchedule = await chrome.runtime.sendMessage({ url: "https://ftc-api.firstinspires.org/v2.0/2023/schedule/" + window.evCode + "?teamNumber=" + team });
  const scheduleQual = await chrome.runtime.sendMessage({ url: "https://ftc-api.firstinspires.org/v2.0/2023/schedule/" + window.evCode + "?tournamentLevel=qual" });
  const schedulePlayoff = await chrome.runtime.sendMessage({ url: "https://ftc-api.firstinspires.org/v2.0/2023/schedule/" + window.evCode + "?tournamentLevel=playoff" });
  allResults = await chrome.runtime.sendMessage({ url: "https://ftc-api.firstinspires.org/v2.0/2023/matches/" + window.evCode });
  rankResponse = await chrome.runtime.sendMessage({ url: "https://ftc-api.firstinspires.org/v2.0/2023/rankings/" + window.evCode });
  // teamSchedule = await fetch("/testTeamSchedule.json").then(response => response.json());
  // allSchedule = await fetch("/testAllSchedule.json").then(response => response.json());
  // allSchedule = allSchedule.schedule;
  // allResults = await fetch("/testMatchResults.json").then(response => response.json());
  // rankResponse = {"Rankings": []};
  if (teamSchedule.error != undefined || scheduleQual.error != undefined || schedulePlayoff.error != undefined || allResults.error != undefined || rankResponse.error != undefined) {
    document.getElementById("error-message").style.display = "block";
    return false;
  }else{
    document.getElementById("error-message").style.display = "none";
  }
  allSchedule = scheduleQual.schedule.concat(schedulePlayoff.schedule);
}

//calculates distance, speed, etc for the animation, or turns it off if it all fits
function updateScroll() {
  console.log("scroll update");

  if (scrollA.offsetHeight > list.offsetHeight) {
    //if it doesn't fit, cancel animations if they exist and redo them
    if (scrollA.getAnimations().length != 0) {
      scrollA.getAnimations()[0].cancel();
      scrollB.getAnimations()[0].cancel();
    }
    //SCROLL SPEED HERE (offsetHeight*a number)
    scrollA.animate({ top: ["0em", -scrollA.offsetHeight + "px"] }, { duration: scrollA.offsetHeight * 27, easing: "linear", iterations: Infinity });
    scrollB.animate({ top: ["0em", -scrollA.offsetHeight + "px"] }, { duration: scrollA.offsetHeight * 27, easing: "linear", iterations: Infinity });
    scrollB.style.display = "block";
  } else {
    //else cancel animations and hide second scroll box
    if (scrollA.getAnimations().length != 0) {
      scrollA.getAnimations()[0].cancel();
      scrollB.getAnimations()[0].cancel();
    }
    scrollB.style.display = "none";
  }
}

//updates the tracker: different states based on match in progress, on deck,
//match upcoming, or the next match needs to increment
var lastVal = -5;
async function statusUpdate() {
  const next = tracker.getNextNum();
  // console.log(next[0]);
  if (next[0] == -1) {
    //no more matches
    if (lastVal != -1) {
      //prevent reanimating
      const content = createDivWithClassAndText("counter-content", "No more matches scheduled for this team.");
      content.style = "bottom: -110%;";
      //animation
      const anim = counterContainer.children[0].animate({ bottom: ["0%", "110%"] }, { duration: 700, easing: "ease-out", fill: "forwards" });
      anim.finished.then(() => {
        counterContainer.replaceChildren(content);
        counterContainer.children[0].animate({ bottom: ["-110%", "0%"] }, { duration: 700, easing: "ease-out", fill: "forwards" });
        counterContainer.style.borderBottomColor = "#707070";
      });
    }
  } else if (next[0] == 0) {
    //in progress
    if (lastVal != 0) {
      //prevent reanimating
      const content = document.createElement("div");
      content.className = "counter-content";
      content.style = "bottom: -110%;";
      if(next[2] != -1){
        //if there is a next match, say so!
        content.appendChild(createDivWithClassAndText("right-border", getShortenedMatchName(next[1]) + ": In progress"));
        content.appendChild(createDivWithClassAndText("", "Next: "+getShortenedMatchName(next[3])+": Queue in"));
        content.appendChild(createDivWithClassAndText("counter led", next[2]-1));
        content.appendChild(createDivWithClassAndText("", "rounds."));
      }else{
        content.appendChild(createDivWithClassAndText("", getShortenedMatchName(next[1]) + ": In progress"));
      }
      //animation
      const anim = counterContainer.children[0].animate({ bottom: ["0%", "110%"] }, { duration: 700, easing: "ease-out", fill: "forwards" });
      anim.finished.then(() => {
        counterContainer.replaceChildren(content);
        counterContainer.children[0].animate({ bottom: ["-110%", "0%"] }, { duration: 700, easing: "ease-out", fill: "forwards" });
        counterContainer.style.borderBottomColor = "#0a72ce";
      });
    }
  } else if (next[0] == 1) {
    //on deck
    if (lastVal != 1) {
      //prevent reanimating
      const content = document.createElement("div");
      content.className = "counter-content";
      content.style = "bottom: -110%;";
      if(tracker.fields.length > 1){
        content.appendChild(createDivWithClassAndText("", getShortenedMatchName(next[1]) + ": Queue NOW - Field "+next[1].field+" -"));
      }else{
        content.appendChild(createDivWithClassAndText("", getShortenedMatchName(next[1]) + ": Queue NOW -"));
      }
     
      if (next[1].getTeamAlliance() == "red") {
        content.appendChild(createDivWithClassAndText("light-ftc-red alliance", "RED"));
      }
      else if (next[1].getTeamAlliance() == "blue") {
        content.appendChild(createDivWithClassAndText("light-ftc-blue alliance", "BLUE"));
      }
      //animation
      const anim = counterContainer.children[0].animate({ bottom: ["0%", "110%"] }, { duration: 700, easing: "ease-out", fill: "forwards" });
      anim.finished.then(() => {
        counterContainer.replaceChildren(content);
        counterContainer.children[0].animate({ bottom: ["-110%", "0%"] }, { duration: 700, easing: "ease-out", fill: "forwards" });
        counterContainer.style.borderBottomColor = "#ff9800";
      });
    }
  } else if (next[0] > 1) {
    //not on deck yet
    if (!(lastVal > 1)) {
      //prevent reanimating
      const content = document.createElement("div");
      content.className = "counter-content";
      content.style = "bottom: -110%;";
      content.appendChild(createDivWithClassAndText("", getShortenedMatchName(next[1]) + ": Queue in"));
      content.appendChild(createDivWithClassAndText("counter led", next[0]-1));
      //change text for multiple fields
      if(tracker.fields.length > 1){
        content.appendChild(createDivWithClassAndText("", "rounds - Field "+next[1].field+" -"));
      }else{
        content.appendChild(createDivWithClassAndText("", "rounds -"));
      }      
      if (next[1].getTeamAlliance() == "red") content.appendChild(createDivWithClassAndText("light-ftc-red alliance", "RED"));
      else if (next[1].getTeamAlliance() == "blue") content.appendChild(createDivWithClassAndText("light-ftc-blue alliance", "BLUE"));
      //animation
      const anim = counterContainer.children[0].animate({ bottom: ["0%", "110%"] }, { duration: 700, easing: "ease-out", fill: "forwards" });
      anim.finished.then(() => {
        counterContainer.replaceChildren(content);
        counterContainer.children[0].animate({ bottom: ["-110%", "0%"] }, { duration: 700, easing: "ease-out", fill: "forwards" });
        counterContainer.style.borderBottomColor = "#26c22d";
      });
      // updateTrackerFields(next[1].description, "Rounds until On Deck:", next[0] - 1, next[1].getTeamAlliance(), "#26c22d");
    }else{
      //if it is the same, update value 
      counterContainer.children[0].children[1].textContent = next[0]-1;
    }
  } else if (next[0] == -2){
    //no matches in the first place
    if (lastVal != -2) {
      //prevent reanimating
      const content = createDivWithClassAndText("counter-content", "No matches scheduled for this team or event not started.");
      content.style = "bottom: -110%;";
      //animation
      const anim = counterContainer.children[0].animate({ bottom: ["0%", "110%"] }, { duration: 700, easing: "ease-out", fill: "forwards" });
      anim.finished.then(() => {
        counterContainer.replaceChildren(content);
        counterContainer.children[0].animate({ bottom: ["-110%", "0%"] }, { duration: 700, easing: "ease-out", fill: "forwards" });
        counterContainer.style.borderBottomColor = "#707070";
      });
    }
  }
  lastVal = next[0]
}

//saves a few lines of code because otherwise *infuriating*
function getShortenedMatchName(match){
  if(match.tournamentLevel == "SEMIFINAL"){
    return "S"+match.series+"M"+match.matchNumber;
  }else if(match.tournamentLevel == "FINAL"){
    return "F"+match.matchNumber;
  }else{
    return "Q"+match.matchNumber;
  }
}

//wait a bit before initing
setTimeout(initialize, 500);

//automatically redoes scroll hasn't resized for 1000ms after being resized (thanks stackoverflow question #2996431)
window.addEventListener('resize', function () {
  if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
  this.resizeTimeout = setTimeout(function () {
    updateScroll();
  }, 1000);
});
