import dotenv from 'dotenv';
import { clickSignSandboxAPI } from '../helpers/clickSignApi.js';

dotenv.config({});

export default class ClickSignController {
  static async createDocument(req, res, next) {
    const { TEMPLATE_KEY, CLICKSIGN_SANDBOX_TOKEN } = process.env;
    try {
      const {
        nome, sobrenome, cpf, telefone, endereco, email,
      } = req.body;

      const { data } = await clickSignSandboxAPI.post(`/api/v1/templates/${TEMPLATE_KEY}/documents?access_token=${CLICKSIGN_SANDBOX_TOKEN}`, {
        document: {
          path: `/Modelos/FORM-${nome.split(' ').join('_').toUpperCase()}-${cpf}.docx`,
          template: {
            data: {
              nome, sobrenome, cpf, telefone, endereco, email,
            },
          },
        },
      });
      return res.status(200).json(data.document);
    } catch (err) {
      return next(err);
    }
  }
}
