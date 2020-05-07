import MIDI from './utility/midi.js';
import Synth from './utility/synth.js';
import * as OnScreenControl from './onscreenControl.js';

//導航列的提醒按鈕
var reminder = document.getElementById('reminderButton');
reminder.addEventListener("click", function () {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
        reminder.setAttribute("class", "btn btn-success my-2 my-sm-0");
        reminder.innerHTML = "AudioContext has successfully started and it's ready to rock.";
    }else{
        reminder.setAttribute("class", "btn btn-success my-2 my-sm-0");
        reminder.innerHTML = "AudioContext has successfully started and it's ready to rock.";
    }
});

var synth = new Synth();
var midi = new MIDI(synth);

function init() {
    synth.init();
    midi.getMidiInputs();
}

//控制元件事件監聽器
OnScreenControl.mainGainSlider.addEventListener("input", synth.setMainGain.bind(synth));
OnScreenControl.ampAttackSlider.addEventListener("input", synth.setAmpAttack.bind(synth));
OnScreenControl.ampDecaySlider.addEventListener("input", synth.setAmpDecay.bind(synth));
OnScreenControl.ampSustainSlider.addEventListener("input", synth.setAmpSustain.bind(synth));
OnScreenControl.ampReleaseSlider.addEventListener("input", synth.setAmpRelease.bind(synth));
OnScreenControl.filterCutSlider.addEventListener("input", synth.setFilterCut.bind(synth));
OnScreenControl.filterResSlider.addEventListener("input", synth.setFilterRes.bind(synth));
OnScreenControl.filterLFOModSlider.addEventListener("input", synth.setFilterLFOMod.bind(synth));
OnScreenControl.bpmSlider.addEventListener("input", synth.setBPM.bind(synth));
OnScreenControl.filterLFORateSlider.addEventListener("input", synth.setFilterLFORate.bind(synth));
OnScreenControl.delayWetSlider.addEventListener("input", synth.setDelayWet.bind(synth));
OnScreenControl.delayFeedbackSlider.addEventListener("input", synth.setDelayFeedback.bind(synth));
OnScreenControl.delayTimeSlider.addEventListener("input", synth.setDelayTime.bind(synth));

var fired = false;
var body = document.getElementsByTagName("body");
body[0].addEventListener("keypress", (event)=>{
    console.log("key down");
    console.log(event.key);
    if(event.key === "t" && fired == false){
        fired = true;
        midi.getMIDIMessage({data:[144, 60, 1]});
    }
});

body[0].addEventListener("keyup", (event)=>{
    console.log("key up");
    fired = false;
    midi.getMIDIMessage({data:[128, 60, 1]});
});

window.addEventListener("load", init);