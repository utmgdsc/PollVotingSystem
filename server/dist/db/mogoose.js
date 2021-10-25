"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.PollResultsModel = exports.PollModel = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("./schema");
exports.PollModel = (0, mongoose_1.model)("Poll", schema_1.pollSchema);
exports.PollResultsModel = (0, mongoose_1.model)("PollResults", schema_1.pollResultsSchema);
(0, mongoose_1.connect)(process.env.MONGODB_URL).catch((err) => {
    throw err;
});
exports.db = mongoose_1.connection;
//# sourceMappingURL=mogoose.js.map