const auth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) return next();
  next({ message: "Forbidden", code: 401 });
};

export { auth };
