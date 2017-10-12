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
const express = require('express');
const bodyParser = require('body-parser');
const botbuilder = require('botbuilder');

const SkypeBot = require('./skypebot');
const SkypeBotConfig = require('./skypebotconfig');

const REST_PORT = (process.env.PORT || 3798);

const botConfig = new SkypeBotConfig(
    process.env.APIAI_ACCESS_TOKEN,
    process.env.APIAI_LANG,
    process.env.APP_ID,
    process.env.APP_SECRET
);

const skypeBot = new SkypeBot(botConfig);
skypeBot.bot.recognizer(new botbuilder.LuisRecognizer(process.env.LUIS_END_POINT));
skypeBot.bot.dialog('conference', function(session, arg){
            
                 session.endDialog('会议时间查询完成');
                
        }).triggerAction({ matches: 'Business.QueryTime' });

        skypeBot.bot.dialog('/', (session) => {
            if (session.message && session.message.text) {
                skypeBot.processMessage(session);
            }
        });

var server = restify.createServer();
server.use(restify.plugins.jsonBodyParser());

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

server.post('/api/messages', skypeBot.botService.listen());
