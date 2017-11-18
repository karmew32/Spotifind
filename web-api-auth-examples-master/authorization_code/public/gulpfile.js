/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*var gulp = require('gulp');

gulp.task('default', function () {
    // place code for your default task here
});*/

function CSong(sid,sdan,seng,skey,sloud,smode,speech,sacous,sinst,slive,sval,stemp,sdur,stime) {  //generic song object so JS won't scream, temp values
this.uri = 'spotify:track:' + sid;
     this.id = sid;
		 this.danceability = sdan;
		 this.energy = seng;
		 this.key = skey;
		 this.loudness = sloud;
		 this.mode = smode;
		 this.speechiness = speech;
		 this.acousticness = sacous;
		 this.instrumentalness = sinst;
		 this.liveness = slive;
		 this.valence = sval;
		 this.tempo = stemp;
		 this.duration_ms = sdur;
		 this.time_signature = stime;
}

var dummySong = new CSong('a',0.0,0.0,0,0.0,0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0);
var avgSong = new CSong('a',0.0,0.0,0,0.0,0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0);
var varianceSong = new CSong('a',0.0,0.0,0,0.0,0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0);  //used to hold variance values
var deviationSong = new CSong('a',0.0,0.0,0,0.0,0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0); //used to hold deviaiton values

var varianceTemp = 0.0;  //helper value for variance calculations

var filterArray = new Array();  //dummy value
var inputArray = new Array();

var flagArray = new Array(5);
var outputArray = new Array(5);

var flag0 = 0;
var flag1 = 0;
var flag2 = 0;
var flag3 = 0;
var flag4 = 0;
var flag5 = 0;
var flag6 = 0;
var flag7 = 0;
var flag8 = 0;
var flag9 = 0;
var flag10 = 0;
var flag11 = 0;

var min = 10;
var max = 20;

//calculates average attributes of input playlist
function averageSong() {
	
	avgSong.acousticness=0;
	avgSong.danceability=0;
	avgSong.energy=0;
	avgSong.instrumentalness=0;
	avgSong.liveness=0;
	avgSong.loudness=0;
	avgSong.mode=0;
	avgSong.speechiness=0;
	avgSong.tempo=0;
	avgSong.time_signature=0;
	avgSong.valence=0;
	
    //populate avgSong with sums
    for (var i = 0; i < filterArray.length; i++) {
        avgSong.acousticness += filterArray[i].acousticness;
        avgSong.danceability += filterArray[i].danceability;
        avgSong.energy += filterArray[i].energy;
        avgSong.instrumentalness += filterArray[i].instrumentalness;
        avgSong.liveness += filterArray[i].liveness;
        avgSong.loudness += filterArray[i].loudness;
        avgSong.mode += filterArray[i].mode;
        avgSong.speechiness += filterArray[i].speechiness;
        avgSong.tempo += filterArray[i].tempo;
        avgSong.time_signature += filterArray[i].time_signature;
        avgSong.valence += filterArray[i].valence;
    }
	console.log('avgSong post sum ac = ' + avgSong.acousticness);

    //turn avgSong's sums into actual averages
    avgSong.acousticness = avgSong.acousticness / filterArray.length;
    avgSong.danceability = avgSong.danceability / filterArray.length;
    avgSong.energy = avgSong.energy / filterArray.length;
    avgSong.instrumentalness = avgSong.instrumentalness / filterArray.length;
    avgSong.liveness = avgSong.liveness / filterArray.length;
    avgSong.loudness = avgSong.loudness / filterArray.length;
    avgSong.mode = Math.round(avgSong.mode / filterArray.length);
    avgSong.speechiness = avgSong.speechiness / filterArray.length;
    avgSong.tempo = avgSong.tempo / filterArray.length;
    avgSong.time_signature = Math.round(avgSong.time_signature / filterArray.length);
    avgSong.valence = avgSong.valence / filterArray.length;
	
	console.log('avgsong ac average = ' + avgSong.acousticness);
}


//calculates 2nd standard deviation of input playlist based on average
//also recalls averageSong at the end to recalculate average without outliers
function deviationVariance() {

    //gotta clear varianceSong in case of previous use
    for (var i = 0; i < filterArray.length; i++) {
        varianceSong.acousticness = 0;
        varianceSong.danceability = 0;
        varianceSong.energy = 0;
        varianceSong.instrumentalness = 0;
        varianceSong.liveness = 0;
        varianceSong.loudness = 0;
        varianceSong.mode = 0;
        varianceSong.speechiness = 0;
        varianceSong.tempo = 0;
        varianceSong.time_signature = 0;
        varianceSong.valence = 0;
    }

    //populate variance song with the sum of squares
    for (var i = 0; i < filterArray.length; i++) {
        varianceTemp = filterArray[i].acousticness - avgSong.acousticness;
        varianceTemp = varianceTemp * varianceTemp;
        varianceSong.acousticness += varianceTemp;

        varianceTemp = filterArray[i].danceability - avgSong.danceability;
        varianceTemp = varianceTemp * varianceTemp;
        varianceSong.danceability += varianceTemp;

        varianceTemp = filterArray[i].energy - avgSong.energy;
        varianceTemp = varianceTemp * varianceTemp;
        varianceSong.energy += varianceTemp;

        varianceTemp = filterArray[i].instrumentalness - avgSong.instrumentalness;
        varianceTemp = varianceTemp * varianceTemp;
        varianceSong.instrumentalness += varianceTemp;

        varianceTemp = filterArray[i].liveness - avgSong.liveness;
        varianceTemp = varianceTemp * varianceTemp;
        varianceSong.liveness += varianceTemp;

        varianceTemp = filterArray[i].loudness - avgSong.loudness;
        varianceTemp = varianceTemp * varianceTemp;
        varianceSong.loudness += varianceTemp;

        //mode is either 0 or 1, therefore outliers are impossible and therefore ignored
        varianceSong.mode = avgSong.mode;

        varianceTemp = filterArray[i].speechiness - avgSong.speechiness;
        varianceTemp = varianceTemp * varianceTemp;
        varianceSong.speechiness += varianceTemp;

        varianceTemp = filterArray[i].tempo - avgSong.tempo;
        varianceTemp = varianceTemp * varianceTemp;
        varianceSong.tempo += varianceTemp;
        //note, tempo is integer value

        varianceTemp = filterArray[i].time_signature - avgSong.time_signature;
        varianceTemp = varianceTemp * varianceTemp;
        varianceSong.time_signature += varianceTemp;

        varianceTemp = filterArray[i].valence - avgSong.valence;
        varianceTemp = varianceTemp * varianceTemp;
        varianceSong.valence += varianceTemp;
    }

    //average out the sum of squares to get an average of squares
    varianceSong.acousticness = varianceSong.acousticness / filterArray.length;
    varianceSong.danceability = varianceSong.danceability / filterArray.length;
    varianceSong.energy = varianceSong.energy / filterArray.length;
    varianceSong.instrumentalness = varianceSong.instrumentalness / filterArray.length;
    varianceSong.liveness = varianceSong.liveness / filterArray.length;
    varianceSong.loudness = varianceSong.loudness / filterArray.length;
    //mode is either 0 or 1, ignored here
    varianceSong.speechiness = varianceSong.speechiness / filterArray.length;
    varianceSong.tempo = varianceSong.tempo / filterArray.length;
    varianceSong.time_signature = varianceSong.time_signature / filterArray.length;
    varianceSong.valence = varianceSong.valence / filterArray.length;

    //since deviation is being used to clean up outliers, 2 standard deviations
    //are used to prevent too many songs from being removed
    deviationSong.acousticness = 2 * Math.sqrt(varianceSong.acousticness);
    deviationSong.danceability = 2 * Math.sqrt(varianceSong.danceability);
    deviationSong.energy = 2 * Math.sqrt(varianceSong.energy);
    deviationSong.instrumentalness = 2 * Math.sqrt(varianceSong.instrumentalness);
    deviationSong.liveness = 2 * Math.sqrt(varianceSong.liveness);
    deviationSong.loudness = 2 * Math.sqrt(varianceSong.loudness);
    //mode is either 0 or 1, but it's so narrow, deviation would cut off anything
    //that doesn't match exactly, therefore deviation is +-1
    deviationSong.mode = 1;
    deviationSong.speechiness = 2 * Math.sqrt(varianceSong.speechiness);
    deviationSong.tempo = 2 * Math.sqrt(varianceSong.tempo);
    deviationSong.time_signature = 2 * Math.sqrt(varianceSong.time_signature);
    deviationSong.valence = 2 * Math.sqrt(varianceSong.valence);
    /*for (var i = 0; i < filterArray.length; i++) {
		console.log('song ' + i + ':');
		console.dir(filterArray[i]);
	}*/
    //clean filterArray so that outlier songs are removed
    for (var i = 0; i < filterArray.length; i++) {
		console.log('i is ' + i + ' and filterLength is ' + filterArray.length);
        if (filterArray[i].acousticness > (avgSong.acousticness + deviationSong.acousticness) || filterArray[i].acousticness < (avgSong.acousticness - deviationSong.acousticness)) {
            filterArray.splice(i, 1);  //at location i of array, removes 1 object
			i--;
        }
        else if (filterArray[i].danceability > (avgSong.danceability + deviationSong.danceability) || filterArray[i].danceability < (avgSong.danceability - deviationSong.danceability)) {
            filterArray.splice(i, 1);  //at location i of array, removes 1 object
			i--;
        }
        else if (filterArray[i].energy > (avgSong.energy + deviationSong.energy) || filterArray[i].energy < (avgSong.energy - deviationSong.energy)) {
            filterArray.splice(i, 1);  //at location i of array, removes 1 object
			i--;
        }
        else if (filterArray[i].instrumentalness > (avgSong.instrumentalness + deviationSong.instrumentalness) || filterArray[i].instrumentalness < (avgSong.instrumentalness - deviationSong.instrumentalness)) {
            filterArray.splice(i, 1);  //at location i of array, removes 1 object
			i--;
        }
        else if (filterArray[i].liveness > (avgSong.liveness + deviationSong.liveness) || filterArray[i].liveness < (avgSong.liveness - deviationSong.liveness)) {
            filterArray.splice(i, 1);  //at location i of array, removes 1 object
			i--;
        }
        else if (filterArray[i].loudness > (avgSong.loudness + deviationSong.loudness) || filterArray[i].loudness < (avgSong.loudness - deviationSong.loudness)) {
            filterArray.splice(i, 1);  //at location i of array, removes 1 object
			i--;
        }
        //we're not cutting things for not matching mode, so no mode check is implemented
        else if (filterArray[i].speechiness > (avgSong.speechiness + deviationSong.speechiness) || filterArray[i].speechiness < (avgSong.speechiness - deviationSong.speechiness)) {
            filterArray.splice(i, 1);  //at location i of array, removes 1 object
			i--;
        }
        else if (filterArray[i].tempo > (avgSong.tempo + deviationSong.tempo) || filterArray[i].tempo < (avgSong.tempo - deviationSong.tempo)) {
            filterArray.splice(i, 1);  //at location i of array, removes 1 object
			i--;
        }
        else if (filterArray[i].time_signature > (avgSong.time_signature + deviationSong.time_signature) || filterArray[i].time_signature < (avgSong.time_signature - deviationSong.time_signature)) {
            filterArray.splice(i, 1);  //at location i of array, removes 1 object
			i--;
        }
        else if (filterArray[i].valence > (avgSong.valence + deviationSong.valence) || filterArray[i].valence < (avgSong.valence - deviationSong.valence)) {
            filterArray.splice(i, 1);  //at location i of array, removes 1 object
			i--;
        }
    }
    //recalculate average
    averageSong();
}

//this uses an array of similarit flags to populate
function sortyBits() {


	
    //clear flagArray if already in use
    if (flagArray.length != 0) {
        flagArray = [];
    }
	
	//set flagArray equal to inputArray's length
    flagArray = new Array(inputArray.length);
	console.log('flagArray length is' + flagArray.length)
    //clear the flag counters
    flag0 = 0;
    flag1 = 0;
    flag2 = 0;
    flag3 = 0;
    flag4 = 0;
    flag5 = 0;
    flag6 = 0;
    flag7 = 0;
    flag8 = 0;
    flag9 = 0;
    flag10 = 0;
    flag11 = 0;

	for (var i=0; i<flagArray.length; i++){
		flagArray[i] = 0;
	}

    //fill flag array to get a better idea of how similar songs are
    for (var i = 0; i < inputArray.length; i++) {
		console.log('i acousticness' + avgSong.acousticness);
        if (inputArray[i].acousticness >= (avgSong.acousticness - .2) && inputArray[i].acousticness <= (avgSong.acousticness + .2)) {
            flagArray[i] += 1;
        }
        if (inputArray[i].danceability >= (avgSong.danceability - .2) && inputArray[i].danceability <= (avgSong.danceability + .2)) {
            flagArray[i] += 1;
        }
        if (inputArray[i].energy >= (avgSong.energy - .2) && inputArray[i].energy <= (avgSong.energy + .2)) {
            flagArray[i] += 1;
        }
        if (inputArray[i].instrumentalness >= (avgSong.instrumentalness - .2) && inputArray[i].instrumentalness <= (avgSong.instrumentalness + .2)) {
            flagArray[i] += 1;
        }
        if (inputArray[i].liveness <= .8 && avgSong.liveness <= .8) {
            flagArray[i] += 1;
        } else if (inputArray[i].liveness >= .8 && avgSong.liveness >= .8) {
            flagArray[i] += 1;
        }
        if (inputArray[i].loudness >= (avgSong.loudness - 12) && inputArray[i].loudness <= (avgSong.loudness + 12)) {
            flagArray[i] += 1;
        }
        if (inputArray[i].mode == avgSong.mode) {
            flagArray[i] += 1;
        }
        //if both songs are pure music
        if (inputArray[i].speechiness <= .33 && avgSong.speechiness <= .33) {
            //they're similar enough
            flagArray[i] += 1;
            //otherwise, so long as they're both not pure music
        } else if (inputArray[i].speechiness > .33 && avgSong.speechiness > .33) {
            //if they're a mixture of speech and song
            if (inputArray[i].speechiness <= .66 && avgSong.speechiness <= .66) {
                //they're similar enough
                flagArray[i] += 1;
                //or if they're just words
            } else if (inputArray[i].speechiness >= .66 && avgSong.speechiness >= .66) {
                //they're similar enough
                flagArray[i] += 1;
                //otherwise, they mismatch and aren't similar
            }
        }
        if (inputArray[i].tempo >= (avgSong.tempo - 20) && inputArray[i].tempo <= (avgSong.tempo + 20)) {
            flagArray[i] += 1;
        }
        if (inputArray[i].time_signature == avgSong.time_signature) {
            flagArray[i] += 1;
        }
        if (inputArray[i].valence >= (avgSong.valence - .2) && inputArray[i].valence <= (avgSong.valence + .2)) {
            flagArray[i] += 1;
        }

        //once all similarity flags have been set for this entry, increment the
        //corresponding flag counter
		//console.log('swich equals ' + flagArray[i]);
        switch (flagArray[i]) {
            case 0:
                flag0 += 1;
                break
            case 1:
                flag1 += 1;
                break
            case 2:
                flag2 += 1;
                break
            case 3:
                flag3 += 1;
                break
            case 4:
                flag4 += 1;
                break
            case 5:
                flag5 += 1;
                break
            case 6:
                flag6 += 1;
                break
            case 7:
                flag7 += 1;
                break
            case 8:
                flag8 += 1;
                break
            case 9:
                flag9 += 1;
                break
            case 10:
                flag10 += 1;
                break
            case 11:
                flag11 += 1;
                break
        }
    }

    //now that the flags have been set
	//clear outputArray if it was used
	if (outputArray.length!=0){
		outputArray = [];
	}
	
    for (var i = 11; i >= 0; i--) {
       /* console.log('flag11= ' + flag11);
		console.log('flag10= ' + flag10);
		console.log('flag9= ' + flag9);
		console.log('flag8= ' + flag8);
		console.log('flag7= ' + flag7);
		console.log('flag6= ' + flag6);
		console.log('flag5= ' + flag5);
		console.log('flag4= ' + flag4);
		console.log('flag3= ' + flag3);
		console.log('flag2= ' + flag2);
		console.log('flag1= ' + flag1);
		console.log('flag0= ' + flag0);*/
        switch (i) {
            case 11:
                while (flag11 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 11) {
                            flag11 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 11');
                        }
						if (outputArray.length >= max) {
							flag11 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 10:
                while (flag10 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 10) {
                            flag10 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 10');
                        }
						if (outputArray.length >= max) {
							flag10 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 9:
                while (flag9 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 9) {
                            flag9 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 9');
                        }
						if (outputArray.length >= max) {
							flag9 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 8:
                while (flag8 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 8) {
                            flag8 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 8');
                        }
						if (outputArray.length >= max) {
							flag8 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 7:
                //special entry check, as 8 to 7 flags is the only time where
                //length would be between min and max (and matter);
                //at 8+, the program only checks for maxing out
                //at 6-, it only checks for reaching minimum
                //so for 7, there needs to be an extra entry-level check in case of mid-values
                if (outputArray.length >= min) {
                    flag7 = -1;
                    i = -1;
                }
                while (flag7 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 7) {
                            flag7 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 7');
                        }
						if (outputArray.length >= min) {
							flag7 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 6:
                while (flag6 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 6) {
                            flag6 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 6');
                        }
						if (outputArray.length >= min) {
							flag6 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 5:
                while (flag5 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 5) {
                            flag5 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 5');
                        }
						if (outputArray.length >= min) {
							flag5 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 4:
                while (flag4 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 4) {
                            flag4 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 4');
                        }
						if (outputArray.length >= min) {
							flag4 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 3:
                while (flag3 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 3) {
                            flag3 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 3');
                        }
						if (outputArray.length >= min) {
							flag3 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 2:
                while (flag2 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 2) {
                            flag2 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 2');
                        }
						if (outputArray.length >= min) {
							flag2 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 1:
                while (flag1 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 1) {
                            flag1 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 1');
                        }
						if (outputArray.length >= min) {
							flag1 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                    
                }
                break
            case 0:
                while (flag0 > 0) {
                    for (var k = 0; k < flagArray.length; k++) {
                        if (flagArray[k] == 0) {
                            flag0 -= 1;
                            outputArray.push(inputArray[k]);
							//console.log('i pushed 0');
                        }
						if (outputArray.length >= min) {
							flag0 = -1;
							i = -1;
							k=flagArray.length;
						}
                    }
                }
                break
        }
    }
}