import { clickSignSandboxAPI } from '../helpers/clickSignApi.js';

export default class ClickSignController {
  static async getDocuments(req, res, next) {
    try {
      const documentRequest = await clickSignSandboxAPI.get(`/api/v1/documents?page=number&access_token=${process.env.CLICKSIGN_SANDBOX_TOKEN}`);
      const { documents } = documentRequest.data;
      return res.status(200).json(documents);
    } catch (err) {
      return next(err);
    }
  }
}
