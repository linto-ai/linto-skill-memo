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
    let extractedEntitie = this.payloadAction.extractEntityFromName(msg.payload, 'action_delete')
    if (!extractedEntitie) {

      if (this.payloadAction.extractEntityFromName(msg.payload, 'isok')) {
        return { say: memoDeleteClean.call(this, tts) }
      } else if (this.payloadAction.extractEntityFromName(msg.payload, 'isko')) {
        return { say: tts.say.isko }
      }

    }
  }
  return { say: `${tts.say.date} ${new Date().toISOString().split('T')[0]}` }
}

function memoList(tts) {
  if (this.getFlowConfig(MEMO_KEY).length > 0) {
    return `${tts.say.read}${this.getFlowConfig(MEMO_KEY)}`
  }
  return tts.say.empty
}

function memoCreate(tts, msg) {
  if (this.payloadAction.checkEntitiesRequire(msg.payload, ['action_create', 'expression'])) {
    debug('I SHOULD CREATE')
    let reminder = this.payloadAction.extractEntityFromName(msg.payload, 'expression').value
    this.getFlowConfig(MEMO_KEY).push(reminder)
    return `${tts.say.create}${reminder}`
  }
  return tts.say.error_create_reminder_missing
}

function memoDeleteClean(tts) {
  this.setFlowConfig(MEMO_KEY, [])
  return tts.say.isok
}