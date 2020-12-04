import dotenv from 'dotenv';

dotenv.config({});

export default class ClickSignController {
  static async createDocument(req, res, next) {
    const { TEMPLATE_KEY, CLICKSIGN_SANDBOX_TOKEN } = process.env;
    try {
      return res.status(200).json({ TEMPLATE_KEY, CLICKSIGN_SANDBOX_TOKEN });
      // const call = apicall(`https://sandbox.clicksign.com/api/v1/templates/${TEMPLATE_KEY}/documents?access_token=d${CLICKSIGN_SANDBOX_TOKEN}`);
    } catch (err) {
      return next(err);
    }
  }
}
