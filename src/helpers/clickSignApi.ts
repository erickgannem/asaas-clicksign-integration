import axios, { AxiosInstance } from 'axios'

const clickSignSandboxAPI: AxiosInstance = axios.create({
  baseURL: 'https://sandbox.clicksign.com/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Host: 'sandbox.clicksign.com'
  }
})

const clickSignLiveAPI = {}

export { clickSignSandboxAPI, clickSignLiveAPI }
