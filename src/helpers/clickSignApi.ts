import axios, { AxiosInstance } from 'axios'

const clickSignAPI: AxiosInstance = axios.create({
  baseURL: 'https://sandbox.clicksign.com/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Host: 'sandbox.clicksign.com'
  }
})

export default clickSignAPI
