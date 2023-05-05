const auth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  next({ message: "Unautherized", code: 401 });
};

export { auth };
