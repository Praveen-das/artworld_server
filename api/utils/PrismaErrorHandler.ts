export const prismaErrorHandler = (err: any, next: any) => {
  if (err.code === "P2002") {
    let message = err.meta.target[0];
    message = message[0].toUpperCase() + message.slice(1);

    return next({
      error: {
        field: message,
        message: `${message} already exists`,
      },
      code: 403,
    });
  }
};
