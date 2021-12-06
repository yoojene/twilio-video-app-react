
import Twilio = require('twilio');

const AccessToken = Twilio.jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;

/**
 * Generate an Access Token for an application user - it generates a token with an
 * identity if one is provided.
 *
 * @return {Object}
 *         {Object.identity} String random indentity
 *         {Object.token} String token generated
 */
export function tokenGenerator(identity) {
  // Create an access token which we will sign and return to the client
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_API_KEY_SID!,
    process.env.TWILIO_API_KEY_SECRET!
  );

  // Assign the provided identity
  token.identity = identity;

  // Point to a particular Sync service, or use the account default Service
  const syncGrant = new SyncGrant({
    serviceSid: process.env.TWILIO_SYNC_SERVICE_SID || 'default'
  });
  token.addGrant(syncGrant);

  // Serialize the token to a JWT string and include it in a JSON response
  return {
    identity: token.identity,
    token: token.toJwt()
  };
}

