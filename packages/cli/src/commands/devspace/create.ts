import { flags as Flags } from '@oclif/command'
import FMCCommand from '../../FMCCommand'
import { createDevspace } from '../../controllers/devspace'
import {parseArg} from '../../logic/args'

export default class DevspaceCreate extends FMCCommand {
  public static description = 'Creates a Devspace'

  public static examples = [
    `$ fmc devspace:create paps`,
    `$ fmc devspace:create acq --arg sharded`,
  ]

  public static flags = {
    ...FMCCommand.flags,
    help: Flags.help({ char: 'h' }),
    arg: Flags.string({ multiple: true}),
  }

  public static args = [
    { name: 'id', required: true },
  ]
  private static parseValue = (v: string) => {
    if (v === 'true') { return true }
    if (v === 'false') { return false }
    if (/\d+\.\d+/.test(v)) { return parseFloat(v) }
    if (/\d+/.test(v)) { return parseInt(v, 10) }
    return v
  }
  private static parseArgValue = (arg: string) => {
    if (arg.includes('=')) {
      const [left, ...rest] = arg.split('=')
      const rightString = rest.join('=')
      const right = DevspaceCreate.parseValue(rightString)
      return {[left]: right}
    } else {
      return {[arg]: true}
    }
  }

  private static parseArg = (arg: any): object => {
    if (arg !== null && arg !== undefined) {
      return arg.map(DevspaceCreate.parseArgValue).reduce((acc: object, a: object) => ({...acc, ...a}))
    }
    return {}
  }
  public async run() {
    const { localDB, uiService } = this.system
    const { args, flags } = this.parse(DevspaceCreate)
    const { id } = args
    const { arg } = flags
    const createDevspaceArgs = DevspaceCreate.parseArg(arg)

    uiService.spinner.start(`Creating namespace ${id}`)
    await createDevspace(id, createDevspaceArgs, this.system)
    await localDB.registerDevspace(id)
    uiService.spinner.succeed()
  }
}
