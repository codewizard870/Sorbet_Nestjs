import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as NodeGeocoder from "node-geocoder";

@Injectable()
export class GoogleMapsService {
  constructor(private config: ConfigService) {}
  private readonly accessKey = this.config.get("GOOGLE_MAPS_ACCESS_KEY");

  options = {
    provider: "google",

    // Optional depending on the providers
    apiKey: this.accessKey, // for Mapquest, OpenCage, Google Premier
    formatter: null, // 'gpx', 'string', ...
  };

  // Using callback

  async getCoordinates(address: string) {
    try {
      console.log("address in get coordinates", address);
      const geocoder = NodeGeocoder(this.options);

      const res = await geocoder.geocode(address);
      console.log("response", res);
      console.log("latitude", res[0].latitude);
      console.log("longitude", res[0].longitude);
      return {
        lat: res[0].latitude,
        lng: res[0].longitude,
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error("An error occured, please try again.")
    }
  }
}
//   constructor(private config: ConfigService) {
//     super();
//   }
//   private readonly accessKey = this.config.get('GOOGLE_MAPS_ACCESS_KEY');

//   async getCoordinates(address: {
//     street: string;
//     number: string;
// //     city: string;
// //     state: string;
// //     postalCode: string;
// //   }) {
//     //     const google = await this.loader.load();
//     //     const geocoder = new google.maps.Geocoder();
//     //     const addressnew =
//     //       address.street +
//     //       ' ' +
//     //       address.number +
//     //       ' ' +
//     //       address.city +
//     //       ' ' +
//     //       address.state +
//     //       ' ' +
//     //       address.postalCode;

//     console.log('address', address);

//     console.log('access key', this.accessKey);

//     //     geocoder.geocode({ address: addressnew }, function (results, status) {
//     //       if (status == 'OK') {
//     //         console.log('results', results[0].geometry.location);
//     //         const { lng, lat } = results[0].geometry.location;
//     //         console.log('lng', lng);
//     //         console.log('lat', lat);
//     //       } else {
//     //         alert('Geocode was not successful for the following reason: ' + status);
//     //       }
//     //     });

//     const googleRes = await this.geocode({
//       params: {
//         key: this.accessKey,
//         address: `${address.street}, ${address.number}, ${address.city}, ${address.state}, ${address.postalCode}`,
//       },
//     });

//     console.log('google Res', googleRes);

//     const { lng, lat } = googleRes.data.results[0].geometry.location;
//     console.log('lng', lng);
//     console.log('lat', lat);

//     return { lng, lat };
//   }
// }
