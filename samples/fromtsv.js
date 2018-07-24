/**
 * Copyright 2018, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START vision_quickstart]
const fs = require('fs');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// Read audio list tsv
const csvParse = require('csv-parse');
let rs = null;
try {
  rs = fs.createReadStream('audio_list_jp_20180720_1.tsv', 'utf-8');
  rs.on('error', err => {
    console.error(err);
    throw err;
  })
} catch (err) {
  console.error(err);
  throw err;
}
const parser = csvParse({delimiter: '\t'});
parser.on('data', data => {
  const outputfile = `Voice/voice_${data[0]}.mp3`
  const request = {
    input: {
      text: data[1],
    },
    voice: {
      languageCode: 'ja-JP',
      name: 'ja-JP-Wavenet-A',
      ssmlGender: 'FEMALE',
      // languageCode: 'en-us',
      // name: 'en-US-Wavenet-C',
      // ssmlGender: 'FEMALE',
    },
    audioConfig: {
      audioEncoding: 'MP3',
    },
  };
  // Performs the Text-to-Speech request
  client.synthesizeSpeech(request, (err, response) => {
    if (err) {
      console.error('ERROR:', err);
      return
    }

    // Write the binary audio content to a local file
    fs.writeFile(outputfile, response.audioContent, 'binary', err => {
      if (err) {
        console.error('ERROR:', err);
        return
      }
      console.log(`Audio content written to file: ${outputfile}`);
    })
  });
})
parser.on('error', err => {
  console.error(err);
  throw err;
})
rs.pipe(parser);
