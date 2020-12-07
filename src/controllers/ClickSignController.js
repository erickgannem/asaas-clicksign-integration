import dotenv from 'dotenv';
import { clickSignSandboxAPI } from '../helpers/clickSignApi.js';

dotenv.config({});

export default class ClickSignController {
  static async createDocument(req, res, next) {
    const { TEMPLATE_KEY, CLICKSIGN_SANDBOX_TOKEN } = process.env;
    try {
      const { nome, endereço, cpf } = req.body;

      const call = await clickSignSandboxAPI.post(`/api/v1/templates/${TEMPLATE_KEY}/documents?access_token=${CLICKSIGN_SANDBOX_TOKEN}`, {
        document: {
          path: '/Modelos/TEST00123.docx',
          template: {
            data: {
              nome,
              endereço,
              cpf,
            },
          },
        },
      });

      return res.status(200).json(call);
    } catch (err) {
      return next(err);
    }
  }
}
