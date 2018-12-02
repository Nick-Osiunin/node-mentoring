import config from '../config/json.json'
import { Product, User } from './models'

const user = new User()
const product = new Product()

console.log(config.name)