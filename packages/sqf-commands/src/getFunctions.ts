import functions from '../exports/functions.json'
import { WikiDocumentation } from './types'

export const getFunctions = () => functions as Record<string, WikiDocumentation>
