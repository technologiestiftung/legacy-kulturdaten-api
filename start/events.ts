import Event from '@ioc:Adonis/Core/Event';
import Logger from '@ioc:Adonis/Core/Logger';
import Database from '@ioc:Adonis/Lucid/Database';
import Application from '@ioc:Adonis/Core/Application';

Event.on('new:user', 'NewUser.sendVerificationMail');
Event.on('new:invitation', 'NewInvitation.sendInvitationMail');
Event.on('new:invitation', 'NewInvitation.sendInvitationMail');

Event.on('offer:update', 'OfferUpdateListener.createRecurringDates');

Event.on('media:create', 'MediaCreateListener.call');

Event.on('db:query', Database.prettyPrint);
