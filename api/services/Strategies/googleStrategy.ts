import { _getUserById, _createUser } from "../userServices";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/redirect",
  },
  async (_, __, profile, done) => {
    try {
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
    } catch (error) {
      console.log("error googleStrategy--->", error);
    }
  }
);
