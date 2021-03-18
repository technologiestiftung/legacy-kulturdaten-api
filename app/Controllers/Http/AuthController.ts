import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AuthRegisterValidator from 'App/Validators/AuthRegisterValidator'
import AuthLoginValidator from 'App/Validators/AuthLoginValidator'

export default class UsersController {

  public async info ({ auth }: HttpContextContract) {
    return auth.user || {}
  }

  public async register ({ request, response }: HttpContextContract) {
    const data = await request.validate(AuthRegisterValidator)
    const user = await User.create(data)
    
    return response.ok({
      user,
      status: 200,
      message: 'Account created successfully',
    })
  }

  public async login ({request, response, auth}: HttpContextContract) {
    const data = await request.validate(AuthLoginValidator)
    const token = await auth.use('api').attempt(data.email, data.password)

    return response.ok({
      token: token.toJSON(),
      status: 200,
      message: 'Logged in successfully',
    })
  }
}