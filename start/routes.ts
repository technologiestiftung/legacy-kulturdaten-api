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
  Route.get('info', 'AuthController.info').as('info');
  Route.get('validate', 'AuthController.validate').as('validate');
})
  .prefix('auth')
  .as('auth');

Route.group(() => {
  Route.group(() => {
    Route.resource('organisation', 'v1/OrganisationController').apiOnly();
  });
}).prefix('v1');
