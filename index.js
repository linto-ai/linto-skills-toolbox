class Utility {
    constructor() {}

    /**
     * @summary a text that will be say by linto
     * 
     * @param {string} toSay string that linto gonna say
     * 
     * @returns {Object} ouptut to put in the msg.payload
     */
    formatToSay(toSay){
        return {
            behavior: toSay
        }
    }

    /** 
     * @summary Load the json file for language
     * 
     * @param {string} filepath the path of the current skills location
     * @param {string} nodeName the node name
     * @param {string} language language selected by the RED flow
     * 
     * @returns {object} language json 
     **/
    loadLanguage(filepath, nodeName, language) {
        if (language === undefined)
            language = process.env.DEFAULT_LANGUAGE

        filepath = filepath.slice(0, filepath.lastIndexOf("/"));
        return require(filepath + '/locales/' + language + '/' + nodeName)[nodeName].response
    }

    /** 
     * @summary Check if the input from linto match the skills to execute
     * 
     * @param {Object} payload the input message payload receive from the flow
     * @param {string} intent the intent keys of the current skills
     * @param {boolean} isConversationalSkill give the information about a conversational skills or not
     * 
     * @returns {Object.isIntent} do the skill will need to be executed
     * @returns {Object.isConversational} do the skill will execute the conversational part
     **/
    intentDetection(payload, intent, isConversationalSkill = false) {
        let output = {
            isIntent: false
        }
        if (isConversationalSkill && !!payload.conversationData && Object.keys(payload.conversationData).length !== 0 && payload.conversationData.intent === intent) {
            output.isIntent = true
            output.isConversational = true
        } else if ((!!payload.conversationData && Object.keys(payload.conversationData).length === 0) && payload.nlu.intent === intent) {
            output.isIntent = true
            output.isConversational = false
        }
        return output
    }

    /** 
     * @summary Check if the input from linto match the multiple intent skills to execute
     * 
     * @param {Object} payload the input message payload receive from the flow
     * @param {Objects} intents A json with all key has intent
     * @param {boolean} isConversationalSkill give the information about a conversational skills or not
     * 
     * @returns {Object.isIntent} do the skill will need to be executed
     * @returns {Object.isConversational} do the skill will execute the conversational part
     * @returns {Object.skill} the name of the skill to execute
     **/
    multipleIntentDetection(payload, intents, isConversationalSkill = false) {
        let output = {
            isIntent: false,
        }
        if (isConversationalSkill && !!payload.conversationData && Object.keys(payload.conversationData).length !== 0 && intents.hasOwnProperty(payload.conversationData.intent)) {
            output.isIntent = true
            output.isConversational = true
            output.skill = payload.conversationData.intent
        } else if ((!!payload.conversationData && Object.keys(payload.conversationData).length === 0) && intents.hasOwnProperty(payload.nlu.intent)) {
            output.isIntent = true
            output.isConversational = false
            output.skill = payload.nlu.intent
        }
        return output
    }

    /** 
     * @summary Extract the first entities by prefix
     * 
     * @param {Object} payload the input message payload receive from the flow
     * @param {String} prefix the prefix to the entitie to find
     * 
     * @returns {Object} The entities found or nothing
     **/
    extractEntityFromPrefix(payload, prefix) {
        for (let entity of payload.nlu.entities) {
            if (entity.entity.includes(prefix)) {
                return entity
            }
        }
        return undefined
    }

    /** 
     * @summary Extract the first entities by entitiesname
     * 
     * @param {Object} payload the input message payload receive from the flow
     * @param {String} prefix the prefix to the entitie to find
     * 
     * @returns {Object} The entities found or nothing
     **/
    extractEntityFromType(payload, entityName) {
        for (let entity of payload.nlu.entities) {
            if (entity.entity === entityName) {
                return entity
            }
        }
        return undefined
    }

    /** 
     * @summary Check if all require data is in the payload message
     * 
     * @param {Object} payload the input message payload receive from the flow
     * @param {String} prefix the prefix to the entitie to find
     * 
     * @returns {Boolean} Give the information if all entities is here
     **/
    checkEntitiesRequire(payload, requireArrayEntities) {
        if (payload.nlu.entitiesNumber === requireArrayEntities.length) {
            for (let entity of payload.nlu.entities) {
                if (requireArrayEntities.indexOf(entity.entity) === -1)
                    return false
            }
            return true
        }
        return false
    }
}

module.exports = new Utility()