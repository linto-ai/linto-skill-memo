const debug = require('debug')('linto:skill:v2:linto-skill:memo:events:memo')
const MEMO_KEY = 'memo'
const ENTITIES_LIST = ["action_create", "action_delete", "action_list"];

module.exports = function (msg) {
  let tts = this.skillConfig[this.skillConfig.language]

  if (!msg.payload.isConversational) {
    if (this.payloadAction.checkEntityRequire(msg.payload, ENTITIES_LIST)) {
      let extractedEntitie = this.payloadAction.extractEntityFromPrefix(msg.payload, 'action_')

      if (extractedEntitie.entity === 'action_create') {
        return { say: memoCreate.call(this, tts, msg) }
      } else if (extractedEntitie.entity === 'action_list') {
        return { say: memoList.call(this, tts) }
      } else if (extractedEntitie.entity === 'action_delete') {
        return { ask: tts.say.delete, conversationData: msg.payload.nlu }
      }

    }
    return { say: tts.say.error_data_missing }
  } else {
    if (this.payloadAction.checkEntitiesRequire(msg.payload, ['isok'])) {
      return { say: memoDeleteClean.call(this, tts) }
    } else if (this.payloadAction.checkEntitiesRequire(msg.payload, ['isko'])) {
      return { say: tts.say.isko }
    }
    return { say: tts.say.error_delete }
  }
}

function memoList(tts) {
  if (this.getFlowConfig(MEMO_KEY).length > 0) {
    return {
      phonetic: `${tts.say.read.phonetic}${this.getFlowConfig(MEMO_KEY)}`,
      text: `${tts.say.read.text}${this.getFlowConfig(MEMO_KEY)}`
    }
  }
  return tts.say.empty
}

function memoCreate(tts, msg) {
  if (this.payloadAction.checkEntitiesRequire(msg.payload, ['action_create', 'expression'])) {

    let reminder_entity = this.payloadAction.extractEntityFromName(msg.payload, 'expression')
    if (reminder_entity === undefined) {
      return { say: tts.say.error_create_reminder_missing }
    }

    let reminder = reminder_entity.value
    this.getFlowConfig(MEMO_KEY).push(reminder)
    return {
      phonetic: `${tts.say.create.phonetic}${reminder}`,
      text: `${tts.say.create.text}${reminder}`
    }
  }
  return { say: tts.say.error_create_reminder_missing }
}

function memoDeleteClean(tts) {
  this.setFlowConfig(MEMO_KEY, [])
  return tts.say.isok
}