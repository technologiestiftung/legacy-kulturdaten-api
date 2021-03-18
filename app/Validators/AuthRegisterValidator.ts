import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
 import { schema, rules } from '@ioc:Adonis/Core/Validator'
 
 export default class AuthRegisterValidator {
   constructor (private context: HttpContextContract) {
   }
 
   public schema = schema.create({
     email: schema.string({ escape: true, trim: true }, [
       rules.email({
         sanitize: true,
       }),
       rules.unique({ table: 'users', column: 'email' }),
     ]),
 
     password: schema.string({ trim: true }, [
       rules.confirmed(),
     ]),
   })
 
   public cacheKey = this.context.routeKey
 
   public messages = {}
 }