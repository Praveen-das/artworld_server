import {
  _addUserAddress,
  _deleteUserAddress,
  _updateUserAddress,
  _createUser,
  _updateUser,
  _addToWishlist,
  _removeFromlist,
  _getUserWishlist,
  _addToRV,
  _getUserById,
  _addSocialMediaLink,
  _removeSocialMediaLink,
  _getArtists,
  _addFollower,
  _removeFollower,
} from "../services/userServices";

import bcrypt from "bcryptjs";
import passport from "passport";
import { generateToken, verifyToken } from "../services/jwt";
import { prismaErrorHandler } from "../utils/PrismaErrorHandler";
import { hashPassword } from "../utils/password";

const getUserById = async (req: any, res: any, next: any) => {
  const id = req.params.id;

  _getUserById(id)
    .then((data) => {
      if (data === null) return res.send(null);
      else {
        let isFollowed = data.followers.some((user) => user?.userId === req.user?.id);
        // @ts-ignore
        data.isFollowedByCurrentUser = isFollowed;
        res.json(data);
      }
    })
    .catch((err) => console.log(err));
};

const createUser = async (req: any, res: any, next: any) => {
  const credentials = req.body;

  if (!credentials) return res.send(400).json("Credentials not provided");

  const hashPass = await hashPassword(req.body.password);

  credentials.password = hashPass;

  _createUser(credentials)
    .then((data) => res.json(data))
    .catch((err) => next(prismaErrorHandler(err)));
};

const signinUser = (req: any, res: any, next: any) => {
  passport.authenticate("user-local", (err: any, user: any) => {
    if (err) return res.status(404).json(err);
    req.logIn(user, (err: any) => {
      if (err) next(err);
      else {
        res.send(req.user);
      }
    });
  })(req, res, next);
};

const signinAdmin = (req: any, res: any, next: any) => {
  passport.authenticate("admin-local", (err: any, user: any) => {
    if (err) return next(err);
    req.logIn(user, (err: any) => {
      if (err) next(err);
      else {
        res.send(req.user);
      }
    });
  })(req, res, next);
};

const logoutUser = (req: any, res: any, next: any) => {
  req.logout((err: any) => {
    if (err) return next(err);
    res.send("logout successfully");
  });
};

const updateUser = async (req: any, res: any, next: any) => {
  let updates = req.body;

  if (updates.c_password) {
    const isValid = await bcrypt.compare(updates.c_password, req.user.password);

    if (isValid) {
      delete updates.c_password;
      updates.password = await hashPassword(updates.password);
    } else {
      return next({
        error: { field: "c_password", message: "Invalid password" },
        code: 401,
      });
    }
  }

  _updateUser(req.user?.id, updates)
    .then((data) => res.status(200).json(data))
    .catch((err) => next(prismaErrorHandler(err)));
};

const sendEmailVerification = async (req: any, res: any, next: any) => {
  // await deleteUserVerificationRecord(req.user?.id);

  const payload = req.body;

  const token = generateToken({ ...payload, user_id: req.user?.id });

  // await setUserVerificationRecord(user_id, token);
  // sendMail(token);
};

const confirmVerification = async (req: any, res: any, next: any) => {
  try {
    const isVerified = await verifyToken(req.query.token);
    if (isVerified) {
      console.log("verified and calling next");
    } else {
      console.log(isVerified);
    }
  } catch (error) {
    next(error);
  }
};

const addUserAddress = async (req: any, res: any, next: any) => {
  const userId = req.user?.id;
  const address = req.body;

  address["userId"] = userId;

  _addUserAddress(address)
    .then(async (data: any) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => next(prismaErrorHandler(err)));
};

const updateUserAddress = async (req: any, res: any, next: any) => {
  const { id, ...updates } = req.body;

  _updateUserAddress(id, updates)
    .then((data) => res.json(data))
    .catch((err) => next(prismaErrorHandler(err)));
};

const deleteUserAddress = async (req: any, res: any, next: any) => {
  const id = req.params.id;

  _deleteUserAddress(id)
    .then((data) => {
      const address = req.user.address;
      const newAddress = address.filter((o: any) => o.id !== data.id);
      console.log(newAddress);
      res.json(newAddress);
    })
    .catch((err) => next(prismaErrorHandler(err)));
};

const addToWishlist = (req: any, res: any, next: any) => {
  const user_id = req.user?.id;
  const product_id = req.params.id;

  console.log({ product_id });

  _addToWishlist({ user_id, product_id })
    .then((data) => res.json(data))
    .catch(next);
};

const removeFromWishlist = (req: any, res: any, next: any) => {
  const id = req.params.id;
  console.log(id);
  _removeFromlist(id)
    .then((data) => res.json(data))
    .catch(next);
};

const getUserWishlist = (req: any, res: any, next: any) => {
  const user_id = req.user?.id;
  if (!user_id) return res.json([]);
  _getUserWishlist(user_id)
    .then((data) => res.json(data))
    .catch(next);
};

const addToRV = (req: any, res: any, next: any) => {
  const user_id = req.user?.id;
  const product_id = req.params.id;

  if (!user_id) return res.json([]);

  _addToRV({ user_id, product_id })
    .then((data) => res.json(data))
    .catch(next);
};

const addSocialMediaLink = (req: any, res: any, next: any) => {
  const user_id = req.user?.id;
  const links = req.body;

  if (!user_id) return res.json([]);

  _addSocialMediaLink(user_id, links)
    .then((data) => res.json(data))
    .catch(next);
};

const removeSocialMediaLink = (req: any, res: any, next: any) => {
  const id = req.params.id;

  _removeSocialMediaLink(id)
    .then((data) => res.json(data))
    .catch(next);
};

//atrists/////////////////////////////

const getArtists = async (req: any, res: any, next: any) => {
  _getArtists()
    .then((data) => res.json(data))
    .catch((err) => next(err));
};
const addFollower = async (req: any, res: any, next: any) => {
  const userId = req.user?.id;
  const followingUserId = req.params?.id;

  _addFollower(userId, followingUserId)
    .then((data: any) => res.json(data))
    .catch((err: any) => next(err));
};

const removeFollower = async (req: any, res: any, next: any) => {
  const id = req.params?.id;

  _removeFollower(id)
    .then((data: any) => res.json(data))
    .catch((err: any) => next(err));
};

export default {
  getUserById,
  createUser,
  signinUser,
  signinAdmin,
  logoutUser,
  sendEmailVerification,
  confirmVerification,
  updateUser,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,

  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  addToRV,

  addSocialMediaLink,
  removeSocialMediaLink,

  getArtists,
  addFollower,
  removeFollower,
};
