import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class NearService {
  constructor() {}

  COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

  async getNearCoinPrice () {
    try {
        const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=NEAR`, {
        headers: {
            'X-CMC_PRO_API_KEY': this.COINMARKETCAP_API_KEY,
        },
        });
        if (response) {
            const data = response.data;
            const price = data?.data?.NEAR?.quote?.USD?.price;
            return price;
        }
    } 
    catch(err) {
        console.error(err);
        throw new Error('An error occurred. Please try again.')
    }
  }

}
