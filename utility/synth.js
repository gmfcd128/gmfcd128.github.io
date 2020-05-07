import * as OnScreenControl from '../onscreenControl.js';
export default class Synth {
    constructor() {
        this.osc = new Tone.Oscillator(440, "sawtooth");
        this.ampEnvelope = new Tone.Envelope(0.1, 0.1, 1, 0.1);
        this.vcaNode = Tone.context.createGain();
        this.pingpong = new Tone.PingPongDelay("4n", 0.7);
    }

    init() {
        //ADSR Envelope Related Variables
        this.ampEnvelope.attack = Nexus.scale(parseFloat(OnScreenControl.ampAttackSlider.value), 0, 1, 0.01, 2);
        this.ampEnvelope.decay = Nexus.scale(parseFloat(OnScreenControl.ampDecaySlider.value), 0, 1, 0.01, 2);
        this.ampEnvelope.sustain = parseFloat(OnScreenControl.ampSustainSlider.value);
        this.ampEnvelope.release = Nexus.scale(parseFloat(OnScreenControl.ampReleaseSlider.value), 0, 1, 0.01, 3);
        //Filter Related Variables
        this.mainFilterLfo = new Tone.LFO(0.1, 0, 4000).start();
        this.mainFilter = new Tone.Filter(Nexus.scale(1 - Math.log10(11 - parseFloat(OnScreenControl.filterCutSlider.value)), 0, 1, 20, 10000), "lowpass", -24);

        this.pingpong.wet.value = parseFloat(OnScreenControl.delayWetSlider.value);
        Tone.Transport.bpm.value = parseFloat(OnScreenControl.bpmSlider.value);


        //Apply connection between nodes and stars the oscilator
      
        this.mainFilterLfo.connect(this.mainFilter.frequency);
        this.osc.connect(this.mainFilter);
        this.mainFilter.connect(this.vcaNode)
        this.ampEnvelope.connect(this.vcaNode.gain);
        this.vcaNode.connect(this.pingpong);
        this.pingpong.connect(Tone.Master);
        Tone.Master.volume.value = Nexus.scale(parseFloat(OnScreenControl.mainGainSlider.value), 0, 1, -50, -10);

        this.setBPM();
        this.setDelayTime();
        this.setFilterLFORate();
        this.osc.start();
    }

    setMainGain() {
        Tone.Master.volume.value = Nexus.scale(parseFloat(OnScreenControl.mainGainSlider.value), 0, 1, -50, -10);
    }

    setAmpAttack() {
        this.ampEnvelope.attack = Nexus.scale(parseFloat(OnScreenControl.ampAttackSlider.value), 0, 1, 0.01, 2);
        console.log(`new attack value:${this.ampEnvelope.attack}`);
    }

    setAmpDecay() {
        this.ampEnvelope.decay = Nexus.scale(parseFloat(OnScreenControl.ampDecaySlider.value), 0, 1, 0.01, 2);
    }

    setAmpSustain() {
        this.ampEnvelope.sustain = parseFloat(OnScreenControl.ampSustainSlider.value);
    }

    setAmpRelease() {
        this.ampEnvelope.release = Nexus.scale(parseFloat(OnScreenControl.ampReleaseSlider.value), 0, 1, 0.01, 3);
    }

    setFilterCut() {
        //將filter的線性移動轉成對數取線，以符合人體工學
        this.mainFilter.frequency.value = Nexus.scale(1 - Math.log10(11 - parseFloat(OnScreenControl.filterCutSlider.value)), 0, 1, 20, 10000);
        console.log(`slider value:${OnScreenControl.filterCutSlider.value}`);
        console.log(`filter cutoff:${this.mainFilter.frequency.value}`);
    }

    setFilterRes() {
        this.mainFilter.Q.value = Nexus.scale(parseFloat(OnScreenControl.filterResSlider.value), 0, 1, 0.01, 10);
    }

    setFilterLFOMod() {
        this.mainFilterLfo.amplitude.value = parseFloat(OnScreenControl.filterLFOModSlider.value);
    }

    setFilterLFORate() {
        if (OnScreenControl.filterLFOSync.checked) {
            var filterLfoRateString;
            var syncValue = parseInt(Nexus.scale(parseFloat(OnScreenControl.filterLFORateSlider.value), 0, 1, 0, 24));
            switch (syncValue) {
                case 0:
                    this.mainFilterLfo.frequency.value = "64m";
                    filterLfoRateString = "64b";
                    break;
                case 1:
                    this.mainFilterLfo.frequency.value = "32m";
                    filterLfoRateString = "32b";
                    break;
                case 2:
                    this.mainFilterLfo.frequency.value = "16m";
                    filterLfoRateString = "16b";
                    break;
                case 3:
                    this.mainFilterLfo.frequency.value = "8m";
                    filterLfoRateString = "8b";
                    break;
                case 4:
                    this.mainFilterLfo.frequency.value = "4m";
                    filterLfoRateString = "4b";
                    break;
                case 5:
                    this.mainFilterLfo.frequency.value = "2m";
                    filterLfoRateString = "2b";
                    break;
                case 6:
                    this.mainFilterLfo.frequency.value = "1m";
                    filterLfoRateString = "1b";
                    break;
                case 7:
                    this.mainFilterLfo.frequency.value = "2n.";
                    filterLfoRateString = "2n.";
                    break;
                case 8:
                    this.mainFilterLfo.frequency.value = "2n";
                    filterLfoRateString = "2n";
                    break;
                case 9:
                    this.mainFilterLfo.frequency.value = "2t";
                    filterLfoRateString = "2t";
                    break;
                case 10:
                    this.mainFilterLfo.frequency.value = "4n.";
                    filterLfoRateString = "4n.";
                    break;
                case 11:
                    this.mainFilterLfo.frequency.value = "4n";
                    filterLfoRateString = "4n";
                    break;
                case 12:
                    this.mainFilterLfo.frequency.value = "4t";
                    filterLfoRateString = "4t";
                    break;
                case 13:
                    this.mainFilterLfo.frequency.value = "8n.";
                    filterLfoRateString = "8n.";
                    break;
                case 14:
                    this.mainFilterLfo.frequency.value = "8n";
                    filterLfoRateString = "8n";
                    break;
                case 15:
                    this.mainFilterLfo.frequency.value = "8t";
                    filterLfoRateString = "8t";
                    break;
                case 16:
                    this.mainFilterLfo.frequency.value = "16n.";
                    filterLfoRateString = "16n.";
                    break;
                case 17:
                    this.mainFilterLfo.frequency.value = "16n";
                    filterLfoRateString = "16n";
                    break;
                case 18:
                    this.mainFilterLfo.frequency.value = "16t";
                    filterLfoRateString = "16t";
                    break;
                case 19:
                    this.mainFilterLfo.frequency.value = "32n.";
                    filterLfoRateString = "32n.";
                    break;
                case 20:
                    this.mainFilterLfo.frequency.value = "32n";
                    filterLfoRateString = "32n";
                    break;
                case 21:
                    this.mainFilterLfo.frequency.value = "32t";
                    filterLfoRateString = "32t";
                    break;
                case 22:
                    this.mainFilterLfo.frequency.value = "64n.";
                    filterLfoRateString = "64n.";
                    break;
                case 23:
                    this.mainFilterLfo.frequency.value = "64n";
                    filterLfoRateString = "64n";
                    break;
                case 24:
                    this.mainFilterLfo.frequency.value = "64t";
                    filterLfoRateString = "64t";
                    break;
            }
            OnScreenControl.filterLFORateDisplay.innerHTML = filterLfoRateString;
        } else {
            //filter not synced to BPM, display rate in Hz
            this.mainFilterLfo.frequency.value = Nexus.scale(parseFloat(OnScreenControl.filterLFORateSlider.value), 0, 1, 0.01, 10);
            OnScreenControl.filterLFORateDisplay.innerHTML = Math.round(this.mainFilterLfo.frequency.value * 100) / 100;
        }
    }

    setBPM() {
        Tone.Transport.bpm.value = parseInt(OnScreenControl.bpmSlider.value);
        OnScreenControl.bpmDisplay.innerHTML = OnScreenControl.bpmSlider.value;
    }

    setDelayWet() {
        this.pingpong.wet.value = parseFloat(OnScreenControl.delayWetSlider.value);
    }

    setDelayFeedback() {
        this.pingpong.feedback.value = parseFloat(OnScreenControl.delayFeedbackSlider.value);
    }

    setDelayTime() {
        var delayString;
        switch (parseInt(OnScreenControl.delayTimeSlider.value)) {
            case 0:
                this.pingpong.delayTime.value = "64t";
                delayString = "64t";
                break;
            case 1:
                this.pingpong.delayTime.value = "64n";
                delayString = "64n";
                break;
            case 2:
                this.pingpong.delayTime.value = "64n.";
                delayString = "64n.";
                break;
            case 3:
                this.pingpong.delayTime.value = "32t";
                delayString = "32t";
                break;
            case 4:
                this.pingpong.delayTime.value = "32n";
                delayString = "32n";
                break;
            case 5:
                this.pingpong.delayTime.value = "32n.";
                delayString = "32n.";
                break;
            case 6:
                this.pingpong.delayTime.value = "16t";
                delayString = "16t";
                break;
            case 7:
                this.pingpong.delayTime.value = "16n";
                delayString = "16n";
                break;
            case 8:
                this.pingpong.delayTime.value = "16n.";
                delayString = "16n.";
                break;
            case 9:
                this.pingpong.delayTime.value = "8t";
                delayString = "8t";
                break;
            case 10:
                this.pingpong.delayTime.value = "8n";
                delayString = "8n";
                break;
            case 11:
                this.pingpong.delayTime.value = "8n.";
                delayString = "8n.";
                break;
            case 12:
                this.pingpong.delayTime.value = "4t";
                delayString = "4t";
                break;
            case 13:
                this.pingpong.delayTime.value = "4n";
                delayString = "4n";
                break;
            case 14:
                this.pingpong.delayTime.value = "4n.";
                delayString = "4n.";
                break;
            case 15:
                this.pingpong.delayTime.value = "2t";
                delayString = "2t";
                break;
            case 16:
                this.pingpong.delayTime.value = "2n";
                delayString = "2n";
                break;
            case 17:
                this.pingpong.delayTime.value = "2n.";
                delayString = "2n.";
                break;
            case 18:
                this.pingpong.delayTime.value = "1m";
                delayString = "1b";
                break;
        }
        OnScreenControl.delayTimeDisplay.innerHTML = delayString;
    }

}