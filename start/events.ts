import Event from '@ioc:Adonis/Core/Event';

Event.on('new:user', 'NewUser.sendVerificationMail');
Event.on('new:invitation', 'NewInvitation.sendInvitationMail');
