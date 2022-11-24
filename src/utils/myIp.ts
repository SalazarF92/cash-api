// commonjs: const { networkInterfaces } = require('os')
// import { networkInterfaces } from "os";
import ip from "ip";

export const myIp = () => {
    return ip.address();
}

// export const getLocalExternalIP = () =>
//   []
//     .concat(...Object.values(networkInterfaces()))
//     .filter((details) => details.family === "IPv4" && !details.internal)
//     .pop().address;

// export const getLocalExternalIP2 = () => {
//   const nets = networkInterfaces();
//   const results = Object.create(null); // Or just '{}', an empty object

//   for (const name of Object.keys(nets)) {
//     for (const net of nets[name]) {
//       // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
//       // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
//       const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
//       if (net.family === familyV4Value && !net.internal) {
//         if (!results[name]) {
//           results[name] = [];
//         }
//         results[name].push(net.address);
//       }
//     }
//   }
//   return results.Ethernet[0];
// };

// export const getLocalIp = () => {
//   return require("dns").lookup(require("os").hostname(), function (err, add, fam) {
//     console.log("addr: " + add);
//   });
// };
