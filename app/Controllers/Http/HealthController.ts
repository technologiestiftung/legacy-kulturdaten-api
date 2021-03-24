import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import HealthCheck from '@ioc:Adonis/Core/HealthCheck';

export default class HealthController {
  public async index({ response }: HttpContextContract) {
    const isLive = await HealthCheck.isLive();

    return isLive ? response.status(200).send('OK') : response.status(400).send({});
  }
}
