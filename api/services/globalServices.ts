const auth = (req: any, res: any, next: any) => {
  console.log(req.isAuthenticated());
  
  if (req.isAuthenticated()) return next();
  next({ message: "Unautherized", code: 401 });
};

export { auth };
