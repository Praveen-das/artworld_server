import { _createUser } from "../services/userServices";

const createUser = (req: any, res: any) => {
  const credentials = req.body;
  _createUser(credentials)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
  res.sendStatus(200);
};

export { createUser };
