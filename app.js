wget http://kent.dl.sourceforge.net/sourceforge/sox/sox-13.0.0.tar.gz
tar xzvf sox-13.0.0.tar.gz
cd sox-13.0.0
./configure
make
sudo make install

/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
'use strict';

const restify = require('restify');
const apiai = require('apiai');

const GoogleBot = require('./gleBot/googleBot');
const botbuilder = require('botbuilder');


var gleBot = new GoogleBot();

var botService = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

var mBot = new botbuilder.UniversalBot(botService);
mBot.dialog('/', (session) => {
    if (session.message && session.message.text) {
        gleBot.processMessage(session);
    }
});

var server = restify.createServer();
server.use(restify.plugins.jsonBodyParser());
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.post('/api/messages', botService.listen());
