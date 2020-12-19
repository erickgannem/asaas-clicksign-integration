import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

dotenv.config({})
const asaasAPI: AxiosInstance = axios.create({
  baseURL: 'https://www.asaas.com/',
  headers: {
    access_token: process.env.ASAAS_API_KEY
  }
})

export default asaasAPI
