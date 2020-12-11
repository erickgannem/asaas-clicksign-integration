import { clickSignSandboxAPI } from '../helpers/clickSignApi.js';

export default class ClickSignController {
  static async getDocuments(req, res, next) {
    try {
      const documentsRequest = await clickSignSandboxAPI.get(`/api/v1/documents?page=number&access_token=${process.env.CLICKSIGN_SANDBOX_TOKEN}`);
      const { documents } = documentsRequest.data;
      return res.status(200).json(documents);
    } catch (err) {
      return next(err);
    }
  }

  static async getDocument(req, res, next) {
    const { document_key: documentKey } = req.params;
    try {
      const documentRequest = await clickSignSandboxAPI.get(`/api/v1/documents/${documentKey}?access_token=${process.env.CLICKSIGN_SANDBOX_TOKEN}`);
      const { data } = documentRequest;
      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }

  static async getSigner(req, res, next) {
    const { signer_key: signerKey } = req.params;
    try {
      const signerRequest = await clickSignSandboxAPI.get(`/api/v1/signers/${signerKey}?access_token=${process.env.CLICKSIGN_SANDBOX_TOKEN}`);
      const { data } = signerRequest;
      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }
}
