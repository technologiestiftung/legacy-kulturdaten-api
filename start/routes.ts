/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async () => {
  return 'OK';
});

Route.get('/health', 'HealthController.index').as('health');

Route.group(() => {
  Route.post('register', 'AuthController.register').as('register');
  Route.get('verify/:email', 'AuthController.verify').as('verify');
  Route.post('login', 'AuthController.login').as('login');
  Route.post('info', 'AuthController.info').as('info');
  Route.post('validate', 'AuthController.validate').as('validate');
  Route.post('logout', 'AuthController.logout').as('logout');
})
  .prefix('auth')
  .as('auth');

Route.group(() => {
  Route.get('', 'InvitationController.index').as('index');
  Route.post('', 'InvitationController.store').as('store');
  Route.delete('/:id', 'InvitationController.destroy').as('destroy');
})
  .prefix('invitation')
  .as('invitation');

Route.group(() => {
  Route.group(() => {
    Route.resource('tag', 'v1/TagController').only(['index', 'show']);

    Route.resource('media', 'v1/MediaController').only(['show', 'update']);
    Route.post('media/:id/translate', 'v1/MediaController.translate');

    Route.resource('organizerType', 'v1/OrganizerTypeController').apiOnly();
    Route.resource(
      'organizerType.organizerSubject',
      'v1/OrganizerSubjectController'
    ).apiOnly();
    Route.resource('organizer', 'v1/OrganizerController').apiOnly();
    Route.post('organizer/:id/translate', 'v1/OrganizerController.translate');

    Route.resource('location', 'v1/LocationController').apiOnly();
    Route.post('location/:id/translate', 'v1/LocationController.translate');

    Route.resource('offer', 'v1/OfferController').apiOnly();
    Route.post('offer/:id/translate', 'v1/OfferController.translate');
    Route.resource('offer.date', 'v1/OfferDateController').apiOnly();
    Route.post(
      'offer/:offer_id/date/:id/translate',
      'v1/OfferDateController.translate'
    );
  });
}).prefix('v1');
