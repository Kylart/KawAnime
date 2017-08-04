/**
 * Created by Kylart on 04/08/2017.
 *
 * This file might be temporary. It intends to help detecting the right format
 * of anime names.
 */

const removeUnwanted = (string) => {
  return string
    .replace(' VOSTFR', '')  // French fansubs
    .replace(' English Subbed', '')   // CCM
    .replace(' Episode', '')  // CCM
    .replace('[Multiple Subtitle]', '')  // Erai-raws
}

module.exports = removeUnwanted
