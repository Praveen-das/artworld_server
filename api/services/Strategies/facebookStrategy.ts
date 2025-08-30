import { Strategy } from "passport-facebook";
import { _getUserById, _createUser } from "../userServices";

export const facebookStrategy = new Strategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    callbackURL: "/auth/facebook/redirect",
    profileFields: ["id", "displayName", "photos", "email"],
  },
  async (_, __, profile, done) => {
    const user = await _getUserById(profile.id);

    if (!user) {
      _createUser({
        displayName: profile.displayName,
        email: profile.emails ? profile.emails[0]?.value : null,
        photo: profile.photos ? profile.photos[0]?.value : "",
        provider: profile.provider,
        id: profile.id,
      })
        .then((user) => {
          done(null, user);
        })
        .catch((err) => console.log(err));
    } else {
      done(null, user);
    }
  }
);
