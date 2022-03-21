import Event from '@ioc:Adonis/Core/Event';
import Logger from '@ioc:Adonis/Core/Logger';
import Database from '@ioc:Adonis/Lucid/Database';
import Application from '@ioc:Adonis/Core/Application';

Event.on('user:new', 'User.sendVerificationMail');

Event.on('auth:requestPasswordReset', 'Auth.sendPasswordResetInstructions');
Event.on('auth:passwordReset', 'Auth.sendPasswordResetNotification');

Event.on('organizerRole:new', 'OrganizerRole.sendInvitationMail');

// Event.on('db:query', Database.prettyPrint);
