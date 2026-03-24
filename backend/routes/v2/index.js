import { Router } from 'express';
import { usersV2Router } from './users.js';
import { reservationsV2Router } from './reservations.js';
import { passesV2Router } from './passes.js';
import { notificationsV2Router } from './notifications.js';
import { authV2Router } from './auth.js';
import { statsV2Router } from './stats.js';
import { paymentsV2Router } from './payments.js';
import { storesV2Router } from './stores.js';
import { auditV2Router } from './audit.js';
import { inquiriesV2Router } from './inquiries.js';
import { memberAuthRouter }  from './memberAuth.js';

export const v2Router = Router();

// POST /api/v2/stores/:storeId/users/lookup
// GET  /api/v2/stores/:storeId/members
v2Router.use('/stores/:storeId/members', usersV2Router);
v2Router.use('/stores/:storeId/users', usersV2Router);

// GET  /api/v2/users/:userId/reservations
v2Router.use('/users/:userId/reservations', usersV2Router);

// GET  /api/v2/users/:userId/passes
// POST /api/v2/stores/:storeId/users/:userId/passes
// PATCH /api/v2/users/:userId/passes/:passId
v2Router.use('/stores/:storeId/users/:userId/passes', passesV2Router);
v2Router.use('/users/:userId/passes', passesV2Router);

// GET  /api/v2/stores/:storeId/reservations/available
// GET  /api/v2/stores/:storeId/reservations
// POST /api/v2/stores/:storeId/reservations
// PATCH /api/v2/stores/:storeId/reservations/:reservationId
v2Router.use('/stores/:storeId/reservations', reservationsV2Router);

// GET  /api/v2/users/:userId/notifications
// PATCH /api/v2/users/:userId/notifications/:notifId
v2Router.use('/users/:userId/notifications', notificationsV2Router);

// POST /api/v2/stores/:storeId/notifications/send
v2Router.use('/stores/:storeId/notifications', notificationsV2Router);

// POST /api/v2/auth/login
// GET  /api/v2/auth/me
v2Router.use('/auth', authV2Router);

// GET  /api/v2/stores/:storeId/stats
v2Router.use('/stores/:storeId/stats', statsV2Router);

// GET  /api/v2/stores/:storeId/payments/products
// POST /api/v2/stores/:storeId/payments/prepare
// POST /api/v2/stores/:storeId/payments/confirm
// GET  /api/v2/stores/:storeId/payments
v2Router.use('/stores/:storeId/payments', paymentsV2Router);

// GET  /api/v2/stores/:storeId
// PUT  /api/v2/stores/:storeId
v2Router.use('/stores/:storeId', storesV2Router);

// GET  /api/v2/audit/:entityType/:entityId
v2Router.use('/audit', auditV2Router);

// POST /api/v2/stores/:storeId/inquiries
// GET  /api/v2/stores/:storeId/inquiries   (admin)
// PATCH /api/v2/stores/:storeId/inquiries/:inquiryId (admin)
v2Router.use('/stores/:storeId/inquiries', inquiriesV2Router);

// POST /api/v2/stores/:storeId/member/register
// POST /api/v2/stores/:storeId/member/login
// GET  /api/v2/stores/:storeId/member/me
v2Router.use('/stores/:storeId/member', memberAuthRouter);
