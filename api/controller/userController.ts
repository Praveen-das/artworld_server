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
import { sendOrderConfirmationMail } from "../services/nodeMailer";
import { generateToken, verifyToken } from "../services/jwt";
import { prismaErrorHandler } from "../utils/PrismaErrorHandler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ioredis from "../config/Redis";

const hashPassword = async (password: string) => {
  const salt = 12;
  return await bcrypt.hash(password, salt);
};

const getUserById = async (req: any, res: any, next: any) => {
  const id = req.params.id

  _getUserById(id)
    .then((data) => {
      let isFollowed = data.followers.some((user: any) => user?.userId === req.user?.id)
      data.isFollowedByCurrentUser = isFollowed
      res.json(data)
    })
    .catch((err) => console.log(err));
}

const createUser = async (req: any, res: any, next: any) => {
  const credentials = req.body;

  const hashPass = await hashPassword(req.body.password);

  credentials.password = hashPass;

  _createUser(credentials)
    .then((data) => res.json(data))
    .catch((err) => {
      prismaErrorHandler(err, next);
      next(err);
    });
};

const signinUser = (req: any, res: any, next: any) => {
  passport.authenticate("local", (err: any, user: any) => {
    if (err) return next(err);
    req.logIn(user, (err: any) => {
      if (err) next(err);
      else {
        console.log(res.getHeaders());
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

  if (updates.old_password) {
    const isValid = await bcrypt.compare(
      updates.old_password,
      req.user.password
    );

    if (isValid) {
      delete updates.old_password;
      updates.password = await hashPassword(updates.password);
    } else {
      return next({
        error: { field: "old_password", message: "Invalid password" },
        code: 401,
      });
    }
  }

  _updateUser(req.user?.id, updates)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      prismaErrorHandler(err, next);
      next(err);
    });
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

  address["user_id"] = userId;

  delete address.isDefault

  _addUserAddress(address)
    .then(async (data: any) => {
      _updateUser(userId, { default_address_id: data.id })
      res.json(data)
    })
    .catch((err) => {
      console.log(err);

      if (err instanceof PrismaClientKnownRequestError)
        err = prismaErrorHandler(err, next)
      res.status(err.code).send(err.error);
    });
};

const updateUserAddress = async (req: any, res: any, next: any) => {
  const { id, ...updates } = req.body;

  try {
    _updateUserAddress(id, updates)
      .then((data) => res.json(data))
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError)
          err = prismaErrorHandler(err, next)
        res.status(err.code).send(err.error);
      });
  } catch (error) {
    next(error);
  }
};

const deleteUserAddress = async (req: any, res: any, next: any) => {
  const id = req.params.id;

  try {
    _deleteUserAddress(id)
      .then((data) => {
        const address = req.user.address
        const newAddress = address.filter((o: any) => o.id !== data.id)
        console.log(newAddress)
        res.json(newAddress)
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError)
          return prismaErrorHandler(err, next);
        next(err);
      });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = (req: any, res: any, next: any) => {
  const user_id = req.user?.id
  const product_id = req.params.id

  _addToWishlist({ user_id, product_id })
    .then(data => res.json(data))
    .catch(next)
}

const removeFromWishlist = (req: any, res: any, next: any) => {
  const id = req.params.id

  _removeFromlist(id)
    .then(data => res.json(data))
    .catch(next)
}

const getUserWishlist = (req: any, res: any, next: any) => {
  const user_id = req.user?.id
  if (!user_id) return res.json([])
  _getUserWishlist(user_id)
    .then(data => res.json(data))
    .catch(next)
}

const addToRV = (req: any, res: any, next: any) => {
  const user_id = req.user?.id
  const product_id = req.params.id

  if (!user_id) return res.json([])

  _addToRV({ user_id, product_id })
    .then(data => res.json(data))
    .catch(next)
}

const addSocialMediaLink = (req: any, res: any, next: any) => {
  const user_id = req.user?.id
  const links = req.body

  if (!user_id) return res.json([])

  _addSocialMediaLink(user_id, links)
    .then(data => res.json(data))
    .catch(next)
}

const removeSocialMediaLink = (req: any, res: any, next: any) => {
  const id = req.params.id

  _removeSocialMediaLink(id)
    .then(data => res.json(data))
    .catch(next)
}

//atrists/////////////////////////////

const getArtists = async (req: any, res: any, next: any) => {
  _getArtists()
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
const addFollower = async (req: any, res: any, next: any) => {
  const userId = req.user?.id
  const followingUserId = req.params?.id

  _addFollower(userId, followingUserId)
    .then((data: any) => res.json(data))
    .catch((err: any) => next(err));
}

const removeFollower = async (req: any, res: any, next: any) => {
  const id = req.params?.id

  _removeFollower(id)
    .then((data: any) => res.json(data))
    .catch((err: any) => next(err));
}

export default {
  getUserById,
  createUser,
  signinUser,
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
  removeFollower
};
