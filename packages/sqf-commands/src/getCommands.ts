import { WikiDocumentation } from './types'
import commands from '../exports/commands.json'

export const getCommands = () => commands as Record<string, WikiDocumentation>
