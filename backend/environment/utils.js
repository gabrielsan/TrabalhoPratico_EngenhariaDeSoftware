const { ValidationError, ForeignKeyConstraintError, EmptyResultError } = require('sequelize');

const handleSequelizeError = (error, res) => {
  console.error(error);

  if (error instanceof ForeignKeyConstraintError) {
    return res.status(400).json(
      { 
        message: global.ENVIRONMENT.ERROR_REASONS_TEXT.FOREIGN_KEY_ERROR, 
        errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.FOREIGN_KEY_ERROR 
      }
    );
  } else if (error instanceof ValidationError) {
    return res.status(400).json(
      { 
        message: global.ENVIRONMENT.ERROR_REASONS_TEXT.VALIDATION_ERROR, 
        errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.VALIDATION_ERROR 
      }
    );
  } else if (error instanceof EmptyResultError) {
    return res.status(400).json(
      { 
        message: global.ENVIRONMENT.ERROR_REASONS_TEXT.EMPTY_RESULT, 
        errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.EMPTY_RESULT 
      }
    );
  } else {
    return res.status(500).json(
      { 
        message: error?.errorMessage || error?.message ? error.errorMessage || error?.message : global.ENVIRONMENT.ERROR_REASONS_TEXT.INTERNAL_ERROR, 
        errCode: global.ENVIRONMENT.ERROR_REASONS_CODE.INTERNAL_ERROR 
      }
    );
  }
};

const formatDateTime =  function (_DATA) {
  const date = new Date(_DATA);
  date.setHours(date.getHours() + 3);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year}`;
}

module.exports = {
    handleSequelizeError,
    formatDateTime
};