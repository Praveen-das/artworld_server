export const prismaErrorHandler = (err: any) => {
  switch (err.code) {
    case "P2002": {
      let target = err.meta.target[0];
      target = target[0].toUpperCase() + target.slice(1);

      return {
        error: {
          field: target,
          message: `${target} already exists`,
        },
        code: 403,
      };
    }

    case "P2000": {
      let target = err.meta.column_name;

      return {
        error: {
          field: target,
          message: `${target} too long`,
        },
        code: 400,
      };
    }

    default:
      return err;
  }
};
