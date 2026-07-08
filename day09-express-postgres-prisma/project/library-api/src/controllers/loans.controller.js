const { loansService } = require("../services/loans.service");
const { asyncHandler } = require("../utils/asyncHandler");

const loansController = {
  borrow: asyncHandler(async (req, res) => {
    // TODO: Extract memberId, bookId from req.body
    // Call loansService.borrow({ memberId, bookId })
    // Return 201 with loan
    // _____________________
  }),

  returnBook: asyncHandler(async (req, res) => {
    // TODO: loansService.return(req.params.id), return 200
    // _____________________
  }),

  stats: asyncHandler(async (_req, res) => {
    // TODO: loansService.getStats(), return 200
    // _____________________
  }),
};

module.exports = { loansController };
