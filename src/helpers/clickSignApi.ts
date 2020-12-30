import axios, { AxiosInstance } from 'axios'

const prefixUrl = (process.env.NODE_ENV === 'production') ? 'app' : 'sandbox'

const clickSignAPI: AxiosInstance = axios.create({
  baseURL: `https://${prefixUrl}.clicksign.com`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Host: `${prefixUrl}.clicksign.com`
  }
})

export default clickSignAPI
