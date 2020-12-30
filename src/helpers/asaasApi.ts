import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

dotenv.config({})

const { ASAAS_API_KEY } = process.env
const asaasAPI: AxiosInstance = axios.create({
  baseURL: 'https://www.asaas.com/',
  headers: {
    access_token: ASAAS_API_KEY
  }
})

export default asaasAPI
