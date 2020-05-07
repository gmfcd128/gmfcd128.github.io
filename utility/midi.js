import * as OnScreenControl from '../onscreenControl.js'

export default class MIDI {
	constructor(synth) {
		//此物件存放瀏覽器當前可用的所有MDI I/O，詳情見https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess
		this.midiObject = null;
		//紀錄MIDI鍵盤按下音的數量
		this.count = 0;
		//ToneJS音訊函示庫
		this.synth = synth;
		//合成器相關參數
		this.freq = null;
		this.pitchBend = 0.5;
		this.midiVelocity = 0;
	}

	getMidiInputs() {
		var self = this;
		//獲取所有可用的MIDI控制器
		navigator.requestMIDIAccess()
			.then(onMIDISuccess, onMIDIFailure);
		//MIDIAccess取得成功
		function onMIDISuccess(midiAccess) {
			self.midiObject = midiAccess;
			console.log("MIDI success.");
			console.log(midiAccess);
			OnScreenControl.midiInputSelector.options.length = 0;
			//將搜尋到的MIDI輸入裝置添加到使用者介面清單
			midiAccess.inputs.forEach(function (input) {
				console.log("MIDI input device detected.");
				OnScreenControl.midiInputSelector.options[OnScreenControl.midiInputSelector.options.length] = new Option(input.name, input.id);
			});
			//MIDI輸入選擇受到點擊時的動作
			OnScreenControl.midiInputSelector.addEventListener("change", function () {
				console.log("midi input change detected");
				self.selectInputDevice(OnScreenControl.midiInputSelector.value);
			});
		}

		function onMIDIFailure() {
			console.log('Could not access your MIDI devices.');
		}

	}

	selectInputDevice(id) {
		for (var input of this.midiObject.inputs.values()) {
			if (input.id == id) {
				//https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback
				//設定後讓callback function可以存取外面的變數
				input.onmidimessage = this.getMIDIMessage.bind(this);
			} else { input.onmidimessage = 0; }
		}
	}


	getMIDIMessage(message) {
		console.log(message.data[0]);
		console.log(message.data[1]);
		console.log(message.data[2]);

		var command = message.data[0];
		var note = message.data[1];
		var value = message.data[2];
		var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
		switch (command) {
			case 144: // noteOn
				//myMidiMonitor.innerHTML = 'Note On ' + message.data[1] + ' Velocity ' + message.data[2];
				if (velocity > 0) {
					this.midiVelocity = 1;
					this.freq = Nexus.mtof(note);
					this.synth.osc.frequency.value = this.freq * this.pitchBend;
					this.synth.ampEnvelope.triggerAttack("+0.0", this.midiVelocity);
					console.log("Another note has been fired up!!")
					if (OnScreenControl.filterLFORetrig.checked) {
						this.synth.mainFilterLfo.stop();
						this.synth.mainFilterLfo.start();
					}
					//  piano.toggleKey(note,true);
					this.count++;
				} else {
					this.count--;
					if (this.count < 1) {
						this.count = 0;
						this.synth.ampEnvelope.triggerRelease();
					}
				}
				break;
			case 128: // noteOff
				//myMidiMonitor.innerHTML = 'Note Off ' + message.data[1] + ' Velocity ' + message.data[2];
				this.count--;
				if (this.count < 1) {
					this.count = 0;
					this.synth.ampEnvelope.triggerRelease();
				}

				break;
			case 224: // pitch bend
				//myMidiMonitor.innerHTML = 'Pitch Bend ' + message.data[1] + ' MSB ' + message.data[2];
				this.pitchBend = Math.pow(2, ((((((message.data[2] << 7) | message.data[1]) * 2) / 16383) - 1) * (bendRange.value)) / 12);
				this.pitchBender.value = value / 127;
				synth.osc.frequency.value = this.freq * this.pitchBend;
				if (message.data[2] === 64) {
					bendAction = false;
				} else {
					bendAction = true;
				}
				break;
			case 191: // control change - cc    
				//myMidiMonitor.innerHTML = 'CC ' + message.data[1] + ' Value ' + message.data[2];
				if (!midiLearn.checked) {
					//look in the controlId array and find the index containing the incoming cc
					var match = controlId.indexOf(message.data[1]);
					if (match >= 0) {
						if (match < 90) { // sliders
							control[match].value = message.data[2] / 127;
							controlCall(match);
						} else { // checkboxes
							if (message.data[2] > 63) {
								control[match].checked = true;
							} else {
								control[match].checked = false;
							}
						}
					}
				}
				else {
					controlId[lastChanged] = message.data[1];
				}
				break;
			case 176: // control change - cc    
				//myMidiMonitor.innerHTML = 'CC ' + message.data[1] + ' Value ' + message.data[2];
				if (!midiLearn.checked) {
					//look in the controlId array and find the index containing the incoming cc
					var match = controlId.indexOf(message.data[1]);
					if (match >= 0) {
						if (match < 90) { // sliders
							control[match].value = message.data[2] / 127;
							controlCall(match);
						} else { // checkboxes
							if (message.data[2] > 63) {
								control[match].checked = true;
							} else {
								control[match].checked = false;
							}
						}
					}
				}

				else {
					controlId[lastChanged] = message.data[1];
				}
				break;
		}
	}

}