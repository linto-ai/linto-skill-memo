const debug = require('debug')('linto:skill:v2:linto-skill:memo')
const LintoSkillNode = require('@linto-ai/linto-components').nodes.lintoSkillNode
const { payloadAction, template } = require('@linto-ai/linto-components').components

const PALETTE_NODE_NAME = 'Memo'

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config)
    new LintoSkillMemo(RED, this, config)
  }

  RED.nodes.registerType('linto-skill-memo', Node,
    {
      settings: {
        lintoSkillMemo: {
          value: {
            template: template.settupSkillTemplate(PALETTE_NODE_NAME),
            command: LintoSkillNode.loadFile(__dirname, 'data/command.md'),
            description: LintoSkillNode.loadFile(__dirname, 'data/description.json')
          },
          exportable: true
        }
      }
    })
}

class LintoSkillMemo extends LintoSkillNode {
  constructor(RED, node, config) {
    super(RED, node, config, __dirname)
    this.init()
  }

  async init() {
    this.setFlowConfig('memo', [])
    this.payloadAction = payloadAction

    await this.configure() // Autoload controllers
  }
}