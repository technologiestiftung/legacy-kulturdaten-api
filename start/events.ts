import Event from '@ioc:Adonis/Core/Event';
import Logger from '@ioc:Adonis/Core/Logger';
import Database from '@ioc:Adonis/Lucid/Database';
import Application from '@ioc:Adonis/Core/Application';

Event.on('user:new', 'user.sendVerificationMail');

Event.on('auth:requestPasswordReset', 'auth.sendPasswordResetInstructions');
Event.on('auth:passwordReset', 'auth.sendPasswortResetNotification');

Event.on('new:invitation', 'NewInvitation.sendInvitationMail');

// Event.on('db:query', Database.prettyPrint);
