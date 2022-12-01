import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import bcrypt from "bcrypt";
import { getUserById, getUserByEmail, _signupUser } from "./userServices";

const initializePassport = (passport: any) => {
  passport.use(localStrategy());
  passport.use(googleStrategy());
  passport.use(facebookStrategy());
  // passport.use(twitterStrategy());

  passport.serializeUser((user: any, done: any) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id: any, done: any) => {
    const user = await getUserById(id);
    return done(null, user);
  });
};

function localStrategy() {
  return new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user: any = await getUserByEmail(email);

      try {
        if (!user)
          return done(
            {
              error: { field: "email", message: "User doesn't exist " },
              code: 401,
            },
            false
          );

        if (await bcrypt.compare(password, user.password)) {
          delete user.password;
          return done(null, user);
        } else
          done(
            {
              error: { field: "password", message: "Incorrect password" },
              code: 401,
            },
            false
          );
      } catch (error) {
        done(error);
      }
    }
  );
}

function googleStrategy() {
  return new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/redirect",
    },
    async (_, __, profile, done) => {
      const user = await getUserById(profile.id);
      
      if (!user) {
        _signupUser({
          displayName: profile.displayName,
          email: profile.emails ? profile.emails[0].value : null,
          photo: profile.photos ? profile.photos[0].value : "",
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
}

function facebookStrategy() {
  return new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: "/auth/facebook/redirect",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (_, __, profile, done) => {
      const user = await getUserById(profile.id);

      if (!user) {
        _signupUser({
          displayName: profile.displayName,
          email: profile.emails ? profile.emails[0].value : null,
          photo: profile.photos ? profile.photos[0].value : "",
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
}

function twitterStrategy() {
  // return new TwitterStrategy(
  //   {
  //     consumerKey: process.env.TWITTER_CLIENT_ID!,
  //     consumerSecret: process.env.TWITTER_CLIENT_SECRET!,
  //     callbackURL: "/auth/twitter/redirect",
  //   },
  //   function (_, __, profile, done) {
  //     console.log(profile);
  //   }
  // );
}

export default initializePassport;
