import clock from "clock"
import { me as appbit } from "appbit"
import { HeartRateSensor } from "heart-rate"
import { BodyPresenceSensor } from "body-presence"
import { today } from "user-activity"
import { battery } from "power"
import { charger } from "power"
import document from "document"
import * as util from "../common/utils"

const bodyPresence = new BodyPresenceSensor()
const heart = new HeartRateSensor()

// Update the clock every minute

clock.granularity = "minutes";

// Update the <text> elements every tick (minute) with the current time, steps, distance, battery level

clock.ontick = (evt) => {

//stuff for working out date/time etc and assigning to the text objects
  
  let tday = evt.date
  console.log(`Datetime: ` + tday)
  let hours = util.zeroPad(tday.getHours()).toString()
  let mins = util.zeroPad(tday.getMinutes()).toString()
  let weekday = util.day(tday.getDay())
  let monthdayNum = util.zeroPad(tday.getDate()).toString()
  let month = util.month(tday.getMonth())
  
  document.getElementById("h1").text = hours.slice(0,1)
  document.getElementById("h2").text = hours.slice(1,2)
  document.getElementById("m1").text = mins.slice(0,1)
  document.getElementById("m2").text = mins.slice(1,2)
  document.getElementById("day1").text = weekday.slice(0,1)
  document.getElementById("day2").text = weekday.slice(1,2)
  document.getElementById("day3").text = weekday.slice(2,3)
  document.getElementById("md1").text = monthdayNum.slice(0,1)
  document.getElementById("md2").text = monthdayNum.slice(1,2)
  document.getElementById("mon1").text = month.slice(0,1)
  document.getElementById("mon2").text = month.slice(1,2)
  document.getElementById("mon3").text = month.slice(2,3)
  
//stuff for getting the step count and splitting to the step objects
  
  const stepsString = today.adjusted.steps.toString()
  console.log(`Stepcount: ` + stepsString)
  
  switch(stepsString.length) {
    case 1:
      document.getElementById("steps0").text = ""
      document.getElementById("steps1").text = ""
      document.getElementById("steps2").text = ""
      document.getElementById("steps3").text = stepsString
      document.getElementById("steps4").text = ""
      document.getElementById("steps5").text = ""
      break;
    case 2:
      document.getElementById("steps0").text = ""
      document.getElementById("steps1").text = ""
      document.getElementById("steps2").text = stepsString.slice(0,1)
      document.getElementById("steps3").text = stepsString.slice(1,2)
      document.getElementById("steps4").text = ""
      document.getElementById("steps5").text = ""
      break;
    case 3:
      document.getElementById("steps0").text = ""
      document.getElementById("steps1").text = ""
      document.getElementById("steps2").text = stepsString.slice(0,1)
      document.getElementById("steps3").text = stepsString.slice(1,2)
      document.getElementById("steps4").text = stepsString.slice(2,3)
      document.getElementById("steps5").text = ""
      break;
    case 4:
      document.getElementById("steps0").text = ""
      document.getElementById("steps1").text = stepsString.slice(0,1)
      document.getElementById("steps2").text = stepsString.slice(1,2)
      document.getElementById("steps3").text = stepsString.slice(2,3)
      document.getElementById("steps4").text = stepsString.slice(3,4)
      document.getElementById("steps5").text = ""
      break;
    case 5:
      document.getElementById("steps0").text = ""
      document.getElementById("steps1").text = stepsString.slice(0,1)
      document.getElementById("steps2").text = stepsString.slice(1,2)
      document.getElementById("steps3").text = stepsString.slice(2,3)
      document.getElementById("steps4").text = stepsString.slice(3,4)
      document.getElementById("steps5").text = stepsString.slice(4,5)
      break;
  }

//stuff for getting the distance and splitting into the distance objects  
  
  const distance = today.adjusted.distance.toString()
  console.log(`Distance: ` + distance)
  
  switch(distance.length) {
    case 1:
      document.getElementById("distance1").text = distance
      document.getElementById("distance2").text = ""
      document.getElementById("distance3").text = ""
      document.getElementById("distanceP").style.visibility = "hidden"
      break;
    case 2:
      document.getElementById("distance1").text = distance.slice(0,1)
      document.getElementById("distance2").text = distance.slice(1,2)
      document.getElementById("distance3").text = ""
      document.getElementById("distanceP").style.visibility = "hidden"
    case 3:
      document.getElementById("distance1").text = distance.slice(0,1)
      document.getElementById("distance2").text = distance.slice(1,2)
      document.getElementById("distance3").text = distance.slice(2,3)
      document.getElementById("distanceP").style.visibility = "hidden"
      break;
    case 4:
      document.getElementById("distance1").text = distance.slice(0,1)
      document.getElementById("distance2").text = distance.slice(1,2)
      document.getElementById("distance3").text = "k"
      document.getElementById("distanceP").style.visibility = "visible"
      break;
    case 5:
      document.getElementById("distance1").text = distance.slice(0,1)
      document.getElementById("distance2").text = distance.slice(1,2)
      document.getElementById("distance3").text = "k"
      document.getElementById("distanceP").style.visibility = "hidden"
      break;
  }
  
//stuff for getting the battery charge level
  
  if (battery.chargeLevel > 66) {
    document.getElementById("tc").style.fill = "lime"
  } else if (battery.chargeLevel > 33) {
    document.getElementById("tc").style.fill = "orange"
  } else {
    document.getElementById("tc").style.fill = "red"
  }
  
  console.log(`Charge: ` + battery.chargeLevel)
  console.log(`Charging: ` + charger.connected)
  
}

//end of the information refreshed every tick

//Body presence sensor, with heart rate sensor inside if body is detected

bodyPresence.addEventListener("reading", () => {

  console.log(`Worn: ` + bodyPresence.present)
  
  if (bodyPresence.present == true) {
    heart.addEventListener("reading", () => {      
      const bpm = heart.heartRate.toString()
      
      console.log(`BPM: ` + heart.heartRate)
      
      switch(bpm.length) {
          case 2:
            document.getElementById("heart1").text = ""
            document.getElementById("heart2").text = bpm.slice(0,1)
            document.getElementById("heart3").text = bpm.slice(1,2)
            break;
          case 3:
            document.getElementById("heart1").text = bpm.slice(0,1)
            document.getElementById("heart2").text = bpm.slice(1,2)
            document.getElementById("heart3").text = bpm.slice(2,3)
            break;
      }
      
    })
    
    heart.start()
    
  } else {
    heart.stop()
    document.getElementById("heart1").text = "n"
    document.getElementById("heart2").text = "/"
    document.getElementById("heart3").text = "a"
  }

})

bodyPresence.start()

//end of body presence / heart rate section