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
  Route.group(() => {
    Route.get('', 'Admin/UserController.index').as('index');
    Route.post('', 'Admin/UserController.store').as('create');
    Route.patch(':id', 'Admin/UserController.update').as('update');
  })
    .prefix('user')
    .as('user');
})
  .prefix('admin')
  .as('admin')
  .middleware('auth:api');

Route.group(() => {
  Route.post('register', 'AuthController.register').as('register');
  Route.get('verify/:email', 'AuthController.verify').as('verify');
  Route.post('login', 'AuthController.login').as('login');
  Route.post('info', 'AuthController.info').as('info').middleware('auth:api');
  Route.post('validate', 'AuthController.validate').as('validate');
  Route.post('logout', 'AuthController.logout')
    .as('logout')
    .middleware('auth:api');

  Route.post('', 'UserController.update').as('update');
})
  .prefix('auth')
  .as('user');

Route.group(() => {
  Route.get('', 'AppTokenController.index').as('index');
  Route.post('', 'AppTokenController.store').as('store');
  Route.delete('', 'AppTokenController.destroy').as('destroy');
})
  .prefix('appToken')
  .as('appToken')
  .middleware('auth:api');

Route.group(() => {
  Route.get('', 'InvitationController.index').as('index');
  Route.post('', 'InvitationController.store').as('store');
  Route.delete('/:id', 'InvitationController.destroy').as('destroy');
})
  .prefix('invitation')
  .as('invitation');

Route.group(() => {
  Route.resource('tag', 'v1/TagController').only(['index', 'show']);
  Route.resource('district', 'v1/DistrictController').only(['index', 'show']);

  Route.resource('mediaLicense', 'v1/MediaLicenseController').only([
    'index',
    'show',
  ]);
  Route.resource('media', 'v1/MediaController').only([
    'show',
    'update',
    'destroy',
  ]);

  Route.resource('organizerType', 'v1/OrganizerTypeController').apiOnly();
  Route.resource(
    'organizerType.organizerSubject',
    'v1/OrganizerSubjectController'
  ).apiOnly();
  Route.resource('organizer', 'v1/OrganizerController').apiOnly();

  Route.resource('location', 'v1/LocationController').apiOnly();
  Route.get('location/:id/accessibility', 'v1/AccessibilityController.show');
  Route.patch(
    'location/:id/accessibility',
    'v1/AccessibilityController.update'
  );
  Route.delete(
    'location/:id/accessibility',
    'v1/AccessibilityController.delete'
  );
  Route.get('location/:id/service', 'v1/ServiceController.show');
  Route.patch('location/:id/service', 'v1/ServiceController.update');
  Route.delete('location/:id/service', 'v1/ServiceController.delete');

  Route.resource('offerMainType', 'v1/OfferMainTypeController').apiOnly();
  Route.resource('offerType', 'v1/OfferTypeController').apiOnly();
  Route.resource('offer', 'v1/OfferController').apiOnly();
  Route.resource('offer.date', 'v1/OfferDateController').apiOnly();
  Route.get('offer/:id/audience', 'v1/AudienceController.show');
  Route.patch('offer/:id/audience', 'v1/AudienceController.update');
  Route.delete('offer/:id/audience', 'v1/AudienceController.delete');
})
  .prefix('v1')
  .middleware('auth:api,app');
