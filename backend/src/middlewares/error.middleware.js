export function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (error.name === "ZodError") {
    return res.status(400).json({
      error: "Validation error",
      details: error.errors
    });
  }

  if (error.code === "23505") {
    return res.status(409).json({
      error: "Duplicated record",
      detail: error.detail
    });
  }

  if (error.code === "23503") {
    return res.status(409).json({
      error: "Foreign key constraint violation",
      detail: error.detail
    });
  }

  res.status(500).json({
    error: "Internal server error",
    detail: error.message
  });
}